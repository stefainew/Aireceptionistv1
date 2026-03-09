import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProblemSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            // Only pin on desktop (min-width: 1024px corresponds to lg breakpoint)
            mm.add("(min-width: 1024px)", () => {
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "top top+=100",
                    end: "bottom bottom",
                    pin: leftColRef.current,
                    pinSpacing: false,
                });
            });

            // Animate the right column items as they scroll into view
            gsap.utils.toArray('.problem-item').forEach((item: any) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 70 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 85%",
                            once: true,
                        }
                    }
                );
            });

            return () => mm.revert();
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative py-24 md:py-32 overflow-x-hidden flex flex-col justify-center">
            {/* Transparent Grid Background (Increased Visibility) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '4rem 4rem',
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                }}
            ></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Editorial Label */}
                <div className="uppercase tracking-[0.2em] text-xs font-bold text-obsidian-200 mb-16 flex items-center gap-4">
                    <span className="w-8 h-px bg-obsidian-200"></span>
                    <span>002 / Проблемът</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative">

                    {/* Left Column (Pinned on Desktop) */}
                    <div className="lg:h-screen lg:flex lg:flex-col lg:pt-[2vh] xl:pt-[8vh] relative z-10" ref={leftColRef}>
                        <h2 className="font-display text-5xl lg:text-5xl xl:text-7xl font-bold uppercase tracking-tighter leading-none mb-8">
                            Вашият бизнес <br />
                            <span className="text-accent-orange">губи пари</span>,<br />
                            докато спите.
                        </h2>
                        <p className="text-xl md:text-2xl font-medium leading-normal text-obsidian-200 max-w-lg">
                            <span className="text-offwhite font-bold">62% от обажданията</span> към малкия бизнес остават без отговор.
                        </p>
                    </div>

                    {/* Right Column (Scrolling content) */}
                    <div className="lg:pt-[20vh] lg:pb-[20vh]">
                        <div className="space-y-24 lg:space-y-48">

                            <div className="problem-item relative">
                                <div className="text-8xl font-display font-black text-obsidian-800 absolute -translate-x-4 -translate-y-4 -z-10 select-none">01</div>
                                <h3 className="font-display text-4xl uppercase font-bold tracking-tight mb-4">Пропуснати възможности</h3>
                                <p className="text-xl text-obsidian-300 leading-relaxed border-l-2 border-accent-orange pl-6">
                                    <span className="text-white font-bold block mb-2">Всяко пропуснато обаждане е клиент, който отива при конкуренцията.</span>
                                    Те не оставят съобщения – те отварят следващия резултат в Google.
                                </p>
                            </div>

                            <div className="problem-item relative">
                                <div className="text-8xl font-display font-black text-obsidian-800 absolute -translate-x-4 -translate-y-4 -z-10 select-none">02</div>
                                <h3 className="font-display text-4xl uppercase font-bold tracking-tight mb-4">Ограничено време</h3>
                                <p className="text-xl text-obsidian-300 leading-relaxed border-l-2 border-accent-orange pl-6">
                                    Рецепционистът работи 8 часа. Вашите клиенти искат да запазят час вечер, през уикенда или рано сутрин, когато няма кой да вдигне.
                                </p>
                            </div>

                            <div className="problem-item relative">
                                <div className="text-8xl font-display font-black text-obsidian-800 absolute -translate-x-4 -translate-y-4 -z-10 select-none">03</div>
                                <h3 className="font-display text-4xl uppercase font-bold tracking-tight mb-4">Скрити разходи</h3>
                                <p className="text-xl text-obsidian-300 leading-relaxed border-l-2 border-accent-orange pl-6">
                                    Заплата, осигуровки, болнични и обучение на персонал струват хиляди левове всеки месец. Човешките грешки струват дори повече.
                                </p>
                            </div>

                            <div className="problem-item bg-accent-orange text-obsidian-900 p-8 md:p-12 transform -rotate-1 shadow-2xl">
                                <h3 className="font-display text-3xl uppercase font-bold tracking-tight mb-4">Потенциална загуба</h3>
                                <p className="text-7xl font-display font-black">-750<span className="text-3xl">лв</span></p>
                                <p className="font-bold uppercase tracking-wider mt-4">Средно на ден от пропуснати обаждания</p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProblemSection;