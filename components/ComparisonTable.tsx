import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const data = [
    {
        label: "Заплата / Такса",
        human: "1,500 лв",
        ai: "79 лв"
    },
    {
        label: "Работно време",
        human: "8 часа / 5 дни",
        ai: "24/7/365"
    },
    {
        label: "Осигуровки",
        human: "+30% разходи",
        ai: "0 лв"
    },
    {
        label: "Отпуски & Болнични",
        human: "Платени",
        ai: "Никога"
    },
    {
        label: "Едновременни разговори",
        human: "1 (Моно)",
        ai: "Неограничени"
    }
];

const ComparisonTable: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const rows = gsap.utils.toArray('.compare-row');

            rows.forEach((row: any, i: number) => {
                gsap.fromTo(row,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: row,
                            start: "top 85%",
                            once: true,
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="comparison" ref={containerRef} className="py-24 md:py-40 bg-transparent text-offwhite scroll-mt-32 border-b-2 border-white/20">
            <div className="max-w-7xl mx-auto px-6">

                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none max-w-2xl">
                        Повече.<br />За по-малко.
                    </h2>
                    <p className="text-xl md:text-2xl font-medium max-w-sm text-offwhite/80">
                        Математиката е проста. Спестявате разходи, докато увеличавате капацитета.
                    </p>
                </div>

                <div className="w-full relative">
                    {/* Headers */}
                    <div className="flex flex-col md:flex-row pb-6 border-b-4 border-white/20 font-display uppercase tracking-widest text-sm font-bold opacity-50">
                        <div className="w-full md:w-1/3 mb-4 md:mb-0">Фактор</div>
                        <div className="w-full md:w-1/3 mb-4 md:mb-0">Традиционен Служител</div>
                        <div className="w-full md:w-1/3 text-accent-orange">Анна (AI)</div>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col">
                        {data.map((item, index) => (
                            <div key={index} className="compare-row flex flex-col md:flex-row items-baseline py-8 md:py-12 border-b-2 border-white/10 hover:bg-white/5 transition-colors duration-500 px-4 -mx-4 group cursor-default">

                                <div className="w-full md:w-1/3 text-xl md:text-2xl font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity mb-4 md:mb-0">
                                    {item.label}
                                </div>

                                <div className="w-full md:w-1/3 text-3xl md:text-5xl font-display font-medium text-white/30 group-hover:text-white/40 line-through transition-colors mb-4 md:mb-0">
                                    {item.human}
                                </div>

                                <div className="w-full md:w-1/3 text-4xl md:text-6xl font-display font-black text-accent-orange transition-colors">
                                    {item.ai}
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ComparisonTable;