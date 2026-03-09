import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FallingPattern } from './ui/falling-pattern';


gsap.registerPlugin(ScrollTrigger);

/* ── Config ── */
const FRAME_COUNT = 192;
const FRAME_SPEED = 1.0;
const IMAGE_SCALE = 1.12; // Zoom in slightly to crop Veo watermark from bottom-right
const FRAME_DIR = '/frames/';
const FRAME_EXT = 'jpg';
const FIRST_BATCH = 20;

/* ── Stat Counter Component ── */
/* ── Stat Counter Component ── */
const StatCounter: React.FC<{
    value: number;
    suffix: string;
    label: string;
    decimals?: number;
}> = ({ value, suffix, label, decimals = 0 }) => {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="flex items-baseline gap-1">
                <span
                    className="stat-number font-display text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter"
                    data-target={value}
                    data-decimals={decimals}
                >
                    0
                </span>
                <span className="font-display text-xl md:text-2xl lg:text-4xl font-bold opacity-70">
                    {suffix}
                </span>
            </div>
            <span className="uppercase tracking-[0.15em] text-[10px] md:text-xs font-bold mt-2 opacity-80">
                {label}
            </span>
        </div>
    );
};

/* ── Main Component ── */
const AudioScrollDemo: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const leftStickyRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
    const currentFrameRef = useRef(0);
    const bgColorRef = useRef('#080a0f');
    const [loaded, setLoaded] = useState(false);

    /* Audio state */
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [fileError, setFileError] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [bars, setBars] = useState<number[]>(new Array(16).fill(10));

    /* ── Audio Setup ── */
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio('/demo.mp3');
            audioRef.current.preload = 'metadata';
        }

        const audio = audioRef.current;
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => {
            if (!isNaN(audio.duration) && audio.duration !== Infinity) {
                setDuration(audio.duration);
            }
        };
        const onEnd = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            setBars(new Array(16).fill(10));
        };
        const onError = () => {
            setIsPlaying(false);
            setFileError(true);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnd);
        audio.addEventListener('error', onError);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnd);
            audio.removeEventListener('error', onError);
            audio.pause();
        };
    }, []);

    const togglePlay = async () => {
        if (fileError) return;
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch {
                setIsPlaying(false);
            }
        }
    };

    /* Visualizer bars animation */
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying) {
            interval = setInterval(() => {
                setBars((prev) =>
                    prev.map((h) => {
                        const target = Math.random() * 100;
                        const move = (target - h) * 0.2;
                        return Math.max(10, h + move);
                    })
                );
            }, 50);
        } else {
            setBars(new Array(16).fill(5));
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (time: number) => {
        if (isNaN(time)) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    /* ── Canvas Drawing ── */
    const drawFrame = useCallback((idx: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = framesRef.current[idx];
        if (!img || !img.complete) return;

        // Use the actual dimension of the canvas in the layout
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Ensure scale covers the canvas, centered
        const scale = Math.max(w / iw, h / ih) * IMAGE_SCALE;
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;

        ctx.fillStyle = bgColorRef.current;
        // Fix for HDPI: we clear the backed size, not just CSS size
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Match the canvas internal resolution to its calculated CSS size
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        // Only resize if dimensions actually changed
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
            }
        }
        drawFrame(currentFrameRef.current);
    }, [drawFrame]);

    /* ── Frame Loader ── */
    useEffect(() => {
        let loadedCount = 0;
        const pad = (n: number) => String(n).padStart(4, '0');

        const sampleBg = (img: HTMLImageElement) => {
            try {
                const s = document.createElement('canvas');
                s.width = 4;
                s.height = 4;
                s.getContext('2d')!.drawImage(img, 0, 0, 4, 4);
                const d = s.getContext('2d')!.getImageData(0, 0, 1, 1).data;
                bgColorRef.current = `rgb(${d[0]},${d[1]},${d[2]})`;
            } catch {
                /* CORS */
            }
        };

        const loadFrame = (idx: number): Promise<void> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    framesRef.current[idx] = img;
                    loadedCount++;
                    if (idx === 0 || idx % 25 === 0) sampleBg(img);
                    resolve();
                };
                img.onerror = () => {
                    loadedCount++;
                    resolve();
                };
                img.src = `${FRAME_DIR}frame_${pad(idx + 1)}.${FRAME_EXT}`;
            });
        };

        let started = false;

        const loadInitialBatch = async () => {
            const promises = [];
            for (let i = 0; i < Math.min(FIRST_BATCH, FRAME_COUNT); i++) {
                promises.push(loadFrame(i));
            }
            await Promise.all(promises);

            if (!started) {
                started = true;
                resizeCanvas();
                drawFrame(0);
                setLoaded(true);

                // Trickle load remaining sequentially to avoid network flood
                const loadRemaining = async () => {
                    for (let i = FIRST_BATCH; i < FRAME_COUNT; i++) {
                        await loadFrame(i);
                        // Optional slight delay if we want to be even nicer to the main thread
                        await new Promise(r => setTimeout(r, 10));
                    }
                };

                // Use requestIdleCallback if available to avoid blocking main thread
                if ('requestIdleCallback' in window) {
                    (window as any).requestIdleCallback(() => loadRemaining());
                } else {
                    setTimeout(loadRemaining, 500);
                }
            }
        };

        // Use IntersectionObserver to lazy-load the heavy image sequence
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                loadInitialBatch();
            }
        }, { rootMargin: '500px' }); // start loading when within 500px of viewport

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        window.addEventListener('resize', resizeCanvas);

        // Also watch the canvas element itself for size changes (e.g. breakpoint layout shifts)
        let resizeObserver: ResizeObserver | null = null;
        if (canvasRef.current) {
            resizeObserver = new ResizeObserver(() => resizeCanvas());
            resizeObserver.observe(canvasRef.current);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            observer.disconnect();
            resizeObserver?.disconnect();
        };
    }, [resizeCanvas, drawFrame]);

    /* ── Scroll-linked frame scrub + Text Effects ── */
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                    onUpdate(self) {
                        const accel = Math.min(self.progress * FRAME_SPEED, 1);
                        const idx = Math.min(
                            Math.floor(accel * FRAME_COUNT),
                            FRAME_COUNT - 1
                        );
                        if (idx !== currentFrameRef.current) {
                            currentFrameRef.current = idx;
                            requestAnimationFrame(() => drawFrame(idx));
                        }
                    },
                },
            });

            // 1. Initial pause for reading heading
            tl.to({}, { duration: 0.2 });

            // 2. Animate features in sequence based on scroll percentage
            const features = gsap.utils.toArray('.feature-text');
            features.forEach((feature: any, i) => {
                tl.fromTo(feature,
                    { opacity: 0, y: 50, filter: 'blur(8px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }
                ).to(feature,
                    { opacity: 0, y: -50, filter: 'blur(8px)', duration: 0.6 },
                    ">0.8" // hold for 0.8 seconds (normalized) before fading
                );
            });

            // 3. Reveal Stats at the end
            tl.fromTo('.stats-container',
                { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
                { opacity: 1, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto', duration: 1.5, ease: 'power2.out' },
                "-=0.4"
            );

            // 4. Count up stats
            const stats = sectionRef.current?.querySelectorAll('.stat-number');
            if (stats) {
                stats.forEach((el) => {
                    const target = parseFloat(el.getAttribute('data-target') || '0');
                    const dec = parseInt(el.getAttribute('data-decimals') || '0');
                    const proxy = { val: 0 };
                    tl.to(proxy, {
                        val: target,
                        duration: 1.5,
                        ease: 'power1.out',
                        onUpdate: () => {
                            if (el) el.textContent = dec === 0 ? Math.round(proxy.val).toString() : proxy.val.toFixed(dec);
                        }
                    }, "<0.5");
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [loaded, drawFrame]);

    return (
        <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-obsidian-900 text-white select-none z-20">
            <FallingPattern
                className="absolute inset-0 z-0 opacity-100 pointer-events-none"
                color="#E5E7EB"
                backgroundColor="#050505"
                density={1.5}
            />

            {/* Top Heading */}
            <div className="absolute top-8 md:top-12 lg:top-16 inset-x-0 z-20 text-center px-4 pointer-events-none">
                <div className="uppercase tracking-[0.2em] text-xs font-bold text-white/60 flex items-center justify-center gap-4 mb-4">
                    <span className="w-8 h-px bg-white/40" />
                    <span>003 / Гласът</span>
                    <span className="w-8 h-px bg-white/40" />
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-display font-bold text-white leading-none tracking-tight">
                    Слушайте как звучи <br className="md:hidden" />
                    <span className="text-accent-orange">бъдещето</span>
                </h2>
            </div>

            {/* Centered MacBook Mockup */}
            <div className="absolute inset-0 pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-24 px-4 md:px-12 lg:px-20 w-full h-full flex items-center justify-center lg:justify-start xl:justify-center">
                <div className="relative w-full h-full max-w-5xl xl:max-w-6xl mx-auto xl:-ml-0 lg:-ml-12 transform transition-transform duration-700 flex flex-col justify-center items-center" style={{ transformStyle: 'preserve-3d' }}>

                    {/* Screen Container -> Making it look like a tablet */}
                    <div className="relative w-full aspect-video bg-obsidian-900 rounded-3xl md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[4px] md:border-[8px] border-black overflow-hidden ring-1 ring-white/10">

                        {/* Fake device "bezel" and top notch/camera */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-4 md:h-6 bg-black rounded-b-xl z-20 flex justify-center items-center">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-900/40 relative">
                                <div className="absolute inset-0 bg-accent-blue/40 rounded-full blur-[2px]"></div>
                            </div>
                        </div>

                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ willChange: "transform" }}
                        />

                        {/* Dark gradient overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-0" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none z-0" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end py-3 sm:py-6 md:py-12 px-4 sm:px-6 z-10 w-full h-full">

                            {/* Audio Player and Title inline */}
                            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-12 pl-0 lg:pl-12 xl:pl-0">
                                {/* Play Button */}
                                <div className="shrink-0 xl:-ml-24">
                                    <button
                                        onClick={togglePlay}
                                        disabled={fileError}
                                        className={`relative group w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-500 overflow-hidden border-2 cursor-pointer
                                                ${fileError
                                                ? 'border-red-500 text-red-500 bg-red-500/10 cursor-not-allowed'
                                                : 'border-white/80 text-white hover:border-white hover:bg-white/10 backdrop-blur-sm'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full" />
                                        <div className="relative z-10 flex flex-col items-center gap-1 md:gap-2">
                                            {fileError ? (
                                                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                                            ) : isPlaying ? (
                                                <Pause className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 fill-current" />
                                            ) : (
                                                <Play className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 fill-current ml-1 md:ml-2" />
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {/* Title + Visualizer */}
                                <div className="flex-1 w-full max-w-xl text-center md:text-left">
                                    <h2 className="font-display text-xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-none mb-2 sm:mb-3 text-white drop-shadow-lg">
                                        Гласът на<br />вашия бизнес.
                                    </h2>

                                    {/* Visualizer */}
                                    <div className="w-full">
                                        <div className="flex items-end justify-between md:justify-start h-8 sm:h-12 md:h-20 gap-1.5 mb-2 sm:mb-3 border-b border-white/30 pb-2 overflow-hidden">
                                            {bars.map((height, index) => (
                                                <div
                                                    key={index}
                                                    className="w-full md:w-6 rounded-t-sm transition-all duration-75 ease-out"
                                                    style={{
                                                        height: `${fileError ? 20 : height}%`,
                                                        opacity: isPlaying ? 1 : 0.3,
                                                        background: isPlaying
                                                            ? 'linear-gradient(to top, rgba(255,255,255,0.6), rgba(255,255,255,1))'
                                                            : 'rgba(255,255,255,0.4)',
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Progress bar */}
                                        <div
                                            className={`w-full md:max-w-md h-4 relative ${fileError ? 'cursor-not-allowed' : 'cursor-pointer group'}`}
                                            onClick={(e) => {
                                                if (audioRef.current && duration > 0 && !fileError) {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const x = e.clientX - rect.left;
                                                    const percentage = x / rect.width;
                                                    audioRef.current.currentTime = percentage * duration;
                                                    setCurrentTime(percentage * duration);
                                                }
                                            }}
                                        >
                                            <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-1 bg-white/20 rounded-full" />
                                            <div
                                                className="absolute inset-0 top-1/2 -translate-y-1/2 h-1 bg-white rounded-full transition-all duration-100 ease-linear"
                                                style={{ width: `${progress}%` }}
                                            />
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                style={{ left: `calc(${progress}% - 6px)` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GSAP Scrolling Features overlay on absolute right on desktop, or covering bottom on mobile */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-30 flex items-end lg:items-center justify-center lg:justify-end px-4 pb-4 md:pb-8 lg:pb-0 lg:pr-12 xl:pr-24 lg:pt-24 xl:pt-16">
                <div className="relative w-full md:max-w-xl lg:max-w-[400px] xl:max-w-[500px] h-44 sm:h-48 md:h-56 lg:h-[70vh] flex items-center justify-center">

                    <div className="feature-text absolute inset-x-0 opacity-0 px-2 lg:px-0">
                        <div className="bg-obsidian-900/40 backdrop-blur-xl p-4 md:p-6 lg:p-8 xl:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] pointer-events-auto">
                            <h3 className="font-display text-xl md:text-3xl uppercase font-bold tracking-tight mb-3 text-accent-orange">Дълбоко Разбиране</h3>
                            <p className="text-base md:text-xl text-obsidian-200 leading-relaxed border-l-2 border-accent-orange pl-4">
                                <span className="text-white font-bold block mb-1">Отговаря не просто с думи, а със смисъл.</span>
                                Нашият AI разпознава контекст, емоция и сленг. Без паузи, без роботизирано "Не ви разбрах".
                            </p>
                        </div>
                    </div>

                    <div className="feature-text absolute inset-x-0 opacity-0 px-2 lg:px-0">
                        <div className="bg-obsidian-900/40 backdrop-blur-xl p-4 md:p-6 lg:p-8 xl:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] pointer-events-auto">
                            <h3 className="font-display text-xl md:text-3xl uppercase font-bold tracking-tight mb-3 text-accent-blue">Безупречна Интонация</h3>
                            <p className="text-base md:text-xl text-obsidian-200 leading-relaxed border-l-2 border-accent-blue pl-4">
                                <span className="text-white font-bold block mb-1">Глас, който вдъхва доверие.</span>
                                100% реалистичен дикторски глас, който се адаптира според разговора – спокоен, уверен и винаги професионален.
                            </p>
                        </div>
                    </div>

                    <div className="feature-text absolute inset-x-0 opacity-0 px-2 lg:px-0">
                        <div className="bg-obsidian-900/40 backdrop-blur-xl p-4 md:p-6 lg:p-8 xl:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] pointer-events-auto">
                            <h3 className="font-display text-xl md:text-3xl uppercase font-bold tracking-tight mb-3 text-white">Повече от Секретар</h3>
                            <p className="text-base md:text-xl text-obsidian-200 leading-relaxed border-l-2 border-white pl-4">
                                <span className="text-white font-bold block mb-1">Записва часове и затваря сделки.</span>
                                Директна интеграция с календара ви. AI рецепционистът проверява наличности и организира срещите ви автоматично.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Stats Overlay at the end (Takes over the screen) */}
            <div className="stats-container absolute inset-0 z-40 bg-obsidian-900/70 backdrop-blur-2xl flex flex-col items-center justify-center px-6 opacity-0 pointer-events-none">
                <h3 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase text-center mb-8 sm:mb-16 lg:mb-24 text-accent-orange drop-shadow-2xl">Резултати от 1-вия месец</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8 lg:gap-x-16 text-white max-w-7xl mx-auto w-full px-4">
                    <StatCounter value={98} suffix="%" label="Доволни клиенти" />
                    <StatCounter value={24} suffix="ч" label="На линия всеки ден" />
                    <StatCounter value={3} suffix="x" label="Записани часове" decimals={1} />
                    <StatCounter value={0} suffix="лв" label="Пропуснати обаждания" />
                </div>
            </div>

        </section>
    );
};

export default AudioScrollDemo;
