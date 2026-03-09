import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView } from 'framer-motion';
import { Heart, Vote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GREEN = '#16A34A';
const BLUE = '#0044FF';

const CHARITIES = [
  'БЧК',
  'SOS Детски Селища',
  'Каузи.бг',
  'УНИЦЕФ България',
  'Анимус',
];

const MARQUEE_TEXT = 'ДОБРОТО Е ЗАРАЗНО';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const pillVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const GoodnessMission: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' });
  const [isOnScreen, setIsOnScreen] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // GSAP count-up triggered when inView
  useEffect(() => {
    if (!inView || !percentRef.current) return;
    const counter = { val: 0 };
    gsap.to(counter, {
      val: 20,
      duration: 2.4,
      ease: 'power2.inOut',
      onUpdate() {
        if (percentRef.current) {
          percentRef.current.textContent = Math.round(counter.val).toString();
        }
      },
    });
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 md:py-40 bg-white text-obsidian-900 overflow-hidden${!isOnScreen ? ' gm-paused' : ''}`}
      style={{ borderTop: '2px solid rgba(5,5,5,0.08)' }}
    >
      {/* ── Robot image — right side, gradient fade ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        aria-hidden
        className="goodness-robot-img"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '52%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <img
          src="/Generated Image March 09, 2026 - 11_13AM (1).png"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0.55,
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 22%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 22%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,1) 100%)',
          }}
        />
        {/* Extra fade at the bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to top, white 0%, transparent 100%)',
        }} />
      </motion.div>

      {/* ── CSS keyframes for marquee & pulse ── */}
      <style>{`
        @keyframes goodness-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes goodness-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.35; }
          70%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes goodness-heartbeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.3); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.2); }
        }
        @media (max-width: 768px) {
          .goodness-robot-img {
            width: 100% !important;
            height: 50% !important;
            opacity: 0.7 !important;
          }
        }
        .gm-paused * { animation-play-state: paused !important; }
      `}</style>

      {/* ── Decorative background blobs ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: '-8rem', right: '-8rem',
          width: '40rem', height: '40rem',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GREEN}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', bottom: '4rem', left: '-6rem',
          width: '28rem', height: '28rem',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="uppercase tracking-[0.2em] text-xs font-bold flex items-center gap-4 mb-10"
          style={{ color: 'rgba(5,5,5,0.38)' }}
        >
          <span className="w-8 h-px" style={{ background: 'rgba(5,5,5,0.18)' }} />
          <span>005 / Мисия</span>
          <span className="w-8 h-px" style={{ background: 'rgba(5,5,5,0.18)' }} />
        </motion.div>

        {/* Heading — clip-path wipe */}
        <motion.h2
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 1 }}
          animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
          className="font-display font-black uppercase tracking-tighter leading-none mb-8 text-obsidian-900"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
        >
          Доброто<br />
          <span style={{ color: GREEN }}>е заразно.</span>
        </motion.h2>

      </div>

      {/* Giant 20% number */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 mt-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-start gap-3 leading-none select-none"
        >
          {/* Pulse ring behind the number */}
          <div className="relative">
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${GREEN}`,
                animation: 'goodness-pulse-ring 2.2s cubic-bezier(0.215,0.61,0.355,1) infinite',
              }}
            />
            <span
              ref={percentRef}
              className="font-display font-black tracking-tighter relative"
              style={{
                fontSize: 'clamp(6rem, 22vw, 15rem)',
                lineHeight: 0.85,
                color: '#050505',
                textShadow: `0 0 80px ${GREEN}30`,
              }}
            >
              0
            </span>
          </div>

          <span
            className="font-display font-black"
            style={{
              fontSize: 'clamp(3rem, 11vw, 8rem)',
              lineHeight: 1,
              paddingTop: '0.3em',
              color: BLUE,
            }}
          >
            %
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-sm md:text-base font-bold uppercase tracking-[0.3em] mt-4 ml-1"
          style={{ color: 'rgba(5,5,5,0.38)' }}
        >
          от всяка клиентска такса отива за добро
        </motion.p>
      </div>

      {/* ── Continuous marquee tape ── */}
      <div
        className="relative overflow-hidden my-14 md:my-20 py-5"
        style={{ borderTop: '1px solid rgba(5,5,5,0.07)', borderBottom: '1px solid rgba(5,5,5,0.07)' }}
      >
        <div
          className="flex items-center whitespace-nowrap"
          style={{ width: 'max-content', animation: 'goodness-marquee 22s linear infinite' }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <React.Fragment key={i}>
              <span
                className="font-display font-black uppercase"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  letterSpacing: '0.15em',
                  padding: '0 2.5rem',
                  color: 'rgba(5,5,5,0.18)',
                }}
              >
                {MARQUEE_TEXT}
              </span>
              <span style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: GREEN, opacity: 0.3, padding: '0 0.5rem' }}>
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Body copy + charity grid */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Left: body text */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <motion.p
              variants={fadeUp}
              className="text-xl md:text-2xl font-medium leading-relaxed max-w-lg"
              style={{ color: 'rgba(5,5,5,0.62)' }}
            >
              Вярваме, че технологията трябва да носи не само ефективност —{' '}
              <span className="font-bold" style={{ color: '#050505' }}>но и реална промяна.</span>{' '}
              Всеки месец нашата общност гласува и избира каузата, към която отиват
              20% от всички абонаментни такси.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm font-medium leading-relaxed max-w-sm"
              style={{ color: 'rgba(5,5,5,0.32)' }}
            >
              Резултатите се публикуват публично всеки месец.
            </motion.p>
          </motion.div>

          {/* Right: charities + vote badge */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-bold uppercase tracking-[0.25em] mb-5"
              style={{ color: 'rgba(5,5,5,0.38)' }}
            >
              Този месец потребителите избират от:
            </motion.p>

            {/* Animated charity pills */}
            <motion.div
              variants={container}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="flex flex-wrap gap-3 mb-7"
            >
              {CHARITIES.map((name) => (
                <motion.div
                  key={name}
                  variants={pillVariant}
                  whileHover={{ scale: 1.05, borderColor: GREEN }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full cursor-default"
                  style={{
                    border: `1.5px solid ${GREEN}40`,
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Heart
                    size={12}
                    style={{
                      color: GREEN,
                      animation: 'goodness-heartbeat 1.6s ease-in-out infinite',
                    }}
                    className="shrink-0"
                  />
                  <span
                    className="font-display text-sm font-bold uppercase tracking-widest"
                    style={{ color: 'rgba(5,5,5,0.62)' }}
                  >
                    {name}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Vote callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full cursor-default"
              style={{ border: `1.5px solid ${BLUE}40` }}
            >
              <Vote size={14} style={{ color: BLUE }} className="shrink-0" />
              <span
                className="font-sans text-sm font-medium"
                style={{ color: 'rgba(5,5,5,0.52)' }}
              >
                Следващо гласуване:{' '}
                <span className="font-bold" style={{ color: '#050505' }}>1 Април 2026</span>
              </span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GoodnessMission;
