import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, PhoneCall, Star } from 'lucide-react';
import AnimatedShaderHero from './ui/animated-shader-hero';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-label", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 })
        .from(".hero-heading .char-line", { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }, "-=0.6")
        .from(".hero-subtext", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6")
        .from(".hero-reviews", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
        .from(".hero-macbook", { x: 100, opacity: 0, duration: 1.5, ease: "expo.out" }, "-=1.2")
        .from(".hero-logos", { opacity: 0, duration: 1.5 }, "-=0.4")
        .from(".floating-comment", { scale: 0.8, opacity: 0, y: 20, duration: 1, stagger: 0.15, ease: "back.out(1.2)" }, "-=1.5");

      // Review Stars Shine Animation
      gsap.to(".review-star", {
        opacity: 0.6,
        scale: 1.2,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        ease: "sine.inOut"
      });

      // Continuous floating animation
      gsap.utils.toArray(".floating-comment").forEach((comment: any, i: number) => {
        gsap.to(comment, {
          y: i % 2 === 0 ? "-=15" : "+=15",
          x: i % 2 === 0 ? "+=10" : "-=10",
          rotation: i % 2 === 0 ? 3 : -3,
          duration: 3 + (i % 2),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-x-hidden bg-white text-obsidian-900 min-h-screen flex items-center">


      <div className="max-w-7xl w-full mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">

        {/* Left Column: Text & CTAs */}
        <div className="flex-1 flex flex-col items-start w-full relative z-20">
          <div className="hero-label uppercase tracking-[0.2em] text-xs font-bold text-obsidian-700 mb-8 flex items-center gap-4">
            <span className="w-8 h-px bg-obsidian-900"></span>
            <span>001 / Ново Поколение обслужване</span>
          </div>

          <h1 className="hero-heading font-display text-6xl md:text-8xl lg:text-8xl xl:text-[8rem] font-bold uppercase tracking-tighter leading-[0.85] mb-8">
            <div className="overflow-hidden pb-2">
              <span className="char-line inline-block">Спрете да</span>
            </div>
            <div className="overflow-hidden pb-2">
              <span className="char-line inline-block">губите</span>
            </div>
            <div className="overflow-hidden pb-2 flex items-center gap-4">
              <span className="char-line inline-block text-accent-blue">клиенти.</span>
            </div>
          </h1>

          <div className="hero-subtext max-w-xl mb-10">
            <p className="text-xl md:text-2xl font-medium leading-snug">
              Интелигентен AI рецепционист, който поема обаждания, записва часове и отговаря на въпроси 24/7.
            </p>
            <p className="mt-4 text-obsidian-700 font-semibold">
              Без болнични. Без почивки. Без пропуснати ползи.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="#booking"
              onClick={(e) => scrollToSection(e, 'booking')}
              className="hero-cta pointer-events-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-accent-blue text-white font-display text-xl uppercase tracking-wider font-bold hover:bg-obsidian-900 transition-colors duration-300 w-full sm:w-auto"
            >
              <span>Започнете сега</span>
              <ArrowRight className="w-6 h-6" />
            </a>
            <a
              href="#demo"
              onClick={(e) => scrollToSection(e, 'demo')}
              className="hero-cta pointer-events-auto inline-flex items-center justify-center gap-3 px-8 py-5 border-2 border-obsidian-900 text-obsidian-900 font-display text-xl uppercase tracking-wider font-bold hover:bg-obsidian-900 hover:text-white transition-colors duration-300 w-full sm:w-auto"
            >
              <PhoneCall className="w-5 h-5" />
            </a>
          </div>

          {/* Premium Reviews Section */}
          <div className="hero-reviews flex flex-col sm:flex-row items-center gap-6 mt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-offwhite overflow-hidden bg-obsidian-800 flex items-center justify-center transition-transform hover:scale-110 hover:z-10 cursor-pointer">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-offwhite bg-accent-blue flex items-center justify-center text-[10px] font-bold text-white transition-transform hover:scale-110 hover:z-10 cursor-pointer">
                +150
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="review-star w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                ))}
              </div>
              <p className="text-sm font-semibold">
                <span className="text-accent-blue">4.9/5</span> оценка от бизнеса
              </p>
            </div>
          </div>

          <div className="hero-logos mt-20 w-full border-t border-obsidian-900/10 pt-8">
            <p className="text-xs uppercase tracking-[0.15em] mb-6 font-bold text-obsidian-700">Интегриран в системите на</p>
            <div className="flex flex-wrap items-center gap-8 md:gap-12 opacity-60">
              <span className="text-xl lg:text-2xl font-bold font-serif">LawFirst</span>
              <span className="text-xl lg:text-2xl font-display font-medium tracking-tighter">DENTAL<span className="text-accent-blue">PRO</span></span>
              <span className="text-xl lg:text-2xl font-bold italic">AutoFix</span>
              <span className="text-xl lg:text-2xl font-display font-black tracking-widest">ESTATE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Macbook Video Mockup */}
        <div className="hero-macbook flex-1 w-full relative z-10 perspective-1000 block lg:scale-110 lg:-translate-y-12">

          {/* Orbiting Apple-style Glassmorphism Comments */}
          <div className="pointer-events-none z-30 flex flex-wrap gap-3 justify-around mt-6 lg:absolute lg:inset-0 lg:flex-none lg:mt-0">
            {/* Comment 1: Left middle, pill shape */}
            <div className="floating-comment lg:absolute lg:top-[15%] lg:-left-[15%] xl:-left-[25%] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full py-3 px-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">ИД</div>
              <div>
                <p className="text-sm font-bold text-obsidian-900 leading-tight">Без пропуснати обаждания!</p>
                <p className="text-[10px] text-obsidian-600 font-medium tracking-wide">Иван Д. • Автосервиз</p>
              </div>
            </div>

            {/* Comment 2: Top right, classic apple message bubble */}
            <div className="floating-comment lg:absolute lg:-top-[10%] lg:-right-[5%] xl:-right-[15%] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-3xl rounded-tr-sm p-4 w-48 xl:w-56">
              <p className="text-xs font-semibold text-obsidian-900 mb-2 leading-relaxed xl:text-sm">&quot;Графикът ми е винаги пълен, а дори не вдигам телефона.&quot;</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">М</div>
                <p className="text-[10px] text-obsidian-600 font-medium tracking-wide">Мария • Салон за красота</p>
              </div>
            </div>

            {/* Comment 3: Bottom right, floating card */}
            <div className="floating-comment lg:absolute lg:bottom-[10%] lg:-right-[15%] xl:-right-[25%] gap-3 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-3 flex items-center">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-accent-blue text-[10px]">★</span>)}
                </div>
                <p className="text-xs xl:text-sm font-bold text-obsidian-900">Клиентите са възхитени</p>
                <p className="text-[10px] xl:text-xs text-obsidian-600 font-medium tracking-wide">Дентална клиника</p>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-3xl mx-auto transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700 mt-0" style={{ transformStyle: 'preserve-3d' }}>

            {/* Macbook Screen Frame */}
            <div className="relative pt-[64%] w-full bg-obsidian-900 rounded-t-3xl rounded-b-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border-[6px] border-obsidian-900 overflow-hidden ring-1 ring-white/10">
              {/* Camera / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-obsidian-900 rounded-b-xl z-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-900/40 relative">
                  <div className="absolute inset-0 bg-accent-blue/40 rounded-full blur-[2px]"></div>
                </div>
              </div>

              {/* Screen Content (Animated Shader Hero) */}
              <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center rounded-sm">
                {/* Glowing backdrop */}
                <div className="absolute inset-0 bg-accent-blue/10 animate-pulse-slow z-0"></div>

                <div className="relative z-10 w-full h-full scale-[1.02] transform-gpu">
                  <AnimatedShaderHero
                    headline={{
                      line1: "AI Рецепционист",
                      line2: "За Вашия Бизнес"
                    }}
                    subtitle="Автоматизирано обслужване 24/7. Повече клиенти, по-малко пропуснати обаждания."
                  />
                </div>
              </div>
            </div>

            {/* Macbook Base / Keyboard Area */}
            <div className="relative w-[114%] -ml-[7%] h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-xl rounded-t-sm shadow-2xl flex justify-center items-start">
              <div className="w-32 h-1 bg-gray-400 rounded-b-lg mt-0"></div>
            </div>

            {/* Table shadow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/20 blur-xl rounded-[100%]"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;