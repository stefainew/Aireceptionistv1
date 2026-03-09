import React, { useEffect, useRef } from 'react';
import { Calendar, MessageSquare, Shield, Zap, Globe, Database } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplineScene } from './ui/splite';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Calendar className="w-8 h-8 md:w-10 md:h-10" />,
    title: "Календар",
    description: "Автоматично записване на часове без дублиране."
  },
  {
    icon: <MessageSquare className="w-8 h-8 md:w-10 md:h-10" />,
    title: "Smart SMS",
    description: "Незабавно резюме след всеки разговор."
  },
  {
    icon: <Database className="w-8 h-8 md:w-10 md:h-10" />,
    title: "CRM Връзка",
    description: "Данните се попълват автоматично."
  },
  {
    icon: <Globe className="w-8 h-8 md:w-10 md:h-10" />,
    title: "Много езици",
    description: "Перфектен английски, немски и испански."
  },
  {
    icon: <Shield className="w-8 h-8 md:w-10 md:h-10" />,
    title: "Спам Филтър",
    description: "Блокиране на ботове и реклами."
  },
  {
    icon: <Zap className="w-8 h-8 md:w-10 md:h-10" />,
    title: "Бърз Старт",
    description: "Работи веднага. Без нов хардуер."
  }
];

const Features: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.feature-row');

      items.forEach((item: any, i: number) => {
        gsap.fromTo(item,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: i * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
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
    <section ref={containerRef} className="py-24 md:py-40 bg-obsidian-900 relative overflow-hidden text-offwhite border-b-2 border-white/20">
      {/* Background Robot SVG Decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none select-none" style={{ width: '520px', height: '620px' }}>
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
          {/* Antenna */}
          <line x1="100" y1="10" x2="100" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="100" cy="7" r="4" fill="currentColor"/>
          {/* Head */}
          <rect x="60" y="30" width="80" height="60" rx="10" stroke="currentColor" strokeWidth="3" fill="none"/>
          {/* Eyes */}
          <rect x="74" y="48" width="18" height="14" rx="4" fill="currentColor"/>
          <rect x="108" y="48" width="18" height="14" rx="4" fill="currentColor"/>
          {/* Mouth */}
          <rect x="78" y="70" width="44" height="8" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="90" y1="70" x2="90" y2="78" stroke="currentColor" strokeWidth="2"/>
          <line x1="100" y1="70" x2="100" y2="78" stroke="currentColor" strokeWidth="2"/>
          <line x1="110" y1="70" x2="110" y2="78" stroke="currentColor" strokeWidth="2"/>
          {/* Neck */}
          <rect x="88" y="90" width="24" height="14" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
          {/* Body */}
          <rect x="45" y="104" width="110" height="90" rx="12" stroke="currentColor" strokeWidth="3" fill="none"/>
          {/* Chest panel */}
          <rect x="70" y="118" width="60" height="40" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="86" cy="135" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="100" cy="135" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="114" cy="135" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="76" y1="148" x2="124" y2="148" stroke="currentColor" strokeWidth="2"/>
          {/* Left Arm */}
          <rect x="15" y="108" width="30" height="70" rx="10" stroke="currentColor" strokeWidth="3" fill="none"/>
          <rect x="18" y="172" width="24" height="20" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          {/* Right Arm */}
          <rect x="155" y="108" width="30" height="70" rx="10" stroke="currentColor" strokeWidth="3" fill="none"/>
          <rect x="158" y="172" width="24" height="20" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          {/* Left Leg */}
          <rect x="58" y="194" width="32" height="35" rx="8" stroke="currentColor" strokeWidth="3" fill="none"/>
          <rect x="54" y="224" width="40" height="14" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          {/* Right Leg */}
          <rect x="110" y="194" width="32" height="35" rx="8" stroke="currentColor" strokeWidth="3" fill="none"/>
          <rect x="106" y="224" width="40" height="14" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start">

        <div className="uppercase tracking-[0.2em] text-xs font-bold text-white/60 flex items-center gap-4 mb-6">
          <span className="w-8 h-px bg-white/40" />
          <span>002 / Функции</span>
          <span className="w-8 h-px bg-white/40" />
        </div>

        <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-24 max-w-4xl">
          Секретар.<br />Без паузи.
        </h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-white/20">
          {features.map((feature, index) => (
            <div key={index} className="feature-row group flex flex-col gap-4 py-8 px-6 border-b-2 border-r-0 sm:border-r-2 border-white/20 hover:bg-white/5 transition-colors duration-500 cursor-default last:border-b-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r-2 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+2)]:border-b-2">

              <div className="flex items-center gap-4 text-accent-orange group-hover:text-accent-blue transition-colors duration-500">
                <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                  {feature.icon}
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                  {feature.title}
                </h3>
              </div>

              <p className="text-base md:text-lg font-medium leading-snug tracking-tight opacity-50 group-hover:opacity-100 transition-opacity duration-500 text-white">
                {feature.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;