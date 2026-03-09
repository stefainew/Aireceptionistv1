import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FallingPatternProps {
    className?: string;
    color?: string;
    backgroundColor?: string;
    density?: number;
}

export function FallingPattern({
    className,
    color = '#E5E7EB',
    backgroundColor = '#050505',
    density = 1,
}: FallingPatternProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>();
    const isVisibleRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const COUNT = Math.floor(50 * density);

        const parseHex = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16) || 229;
            const g = parseInt(hex.slice(3, 5), 16) || 231;
            const b = parseInt(hex.slice(5, 7), 16) || 235;
            return { r, g, b };
        };
        const c = parseHex(color);

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles: { x: number; y: number; speed: number; length: number; opacity: number; width: number }[] = [];
        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * (canvas.width || 1920),
                y: Math.random() * (canvas.height || 1080),
                speed: 0.5 + Math.random() * 1.5,
                length: 40 + Math.random() * 80,
                opacity: 0.08 + Math.random() * 0.35,
                width: Math.random() < 0.3 ? 2 : 1,
            });
        }

        let isAnimating = true;

        const draw = () => {
            // Only draw if visible — this is the key optimization
            if (!isVisibleRef.current) {
                isAnimating = false;
                return;
            }
            isAnimating = true;

            const w = canvas.width;
            const h = canvas.height;
            if (!w || !h) { animRef.current = requestAnimationFrame(draw); return; }

            ctx.fillStyle = backgroundColor + 'E6'; // ~90% opacity for trail
            ctx.fillRect(0, 0, w, h);

            for (const p of particles) {
                const grad = ctx.createLinearGradient(p.x, p.y - p.length, p.x, p.y);
                grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0)`);
                grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},${p.opacity})`);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y - p.length);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = grad;
                ctx.lineWidth = p.width;
                ctx.stroke();
                p.y += p.speed;
                if (p.y - p.length > h) {
                    p.y = -p.length;
                    p.x = Math.random() * w;
                }
            }

            animRef.current = requestAnimationFrame(draw);
        };

        // Clear once before starting
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        animRef.current = requestAnimationFrame(draw);

        // Only animate when section is visible — pauses when on Hero or other sections
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting && !isAnimating) {
                    animRef.current = requestAnimationFrame(draw);
                }
            },
            { threshold: 0.01 }
        );
        observer.observe(canvas);

        const handleResize = () => resize();
        window.addEventListener('resize', handleResize);

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [color, backgroundColor, density]);

    return (
        <canvas
            ref={canvasRef}
            className={cn('absolute inset-0 w-full h-full', className)}
        />
    );
}
