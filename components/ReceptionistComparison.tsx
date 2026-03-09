import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Clock,
  Phone,
  Calendar,
  Users,
  Zap,
  Coffee,
  Globe,
  BadgeCheck,
  LucideIcon,
} from 'lucide-react';

// =========================================
// TYPES & DATA
// =========================================

interface FeatureMetric {
  label: string;
  value: number;
  displayValue: string;
  icon: LucideIcon;
}

interface SideData {
  id: 'traditional' | 'ai';
  subtitle: string;
  title: string;
  description: string;
  costLabel: string;
  costSub: string;
  features: FeatureMetric[];
}

const TRADITIONAL: SideData = {
  id: 'traditional',
  subtitle: 'Традиционен служител',
  title: 'Рецепционист',
  description:
    'Ограничено работно време, платени отпуски и болнични, скъпи осигуровки и само един разговор едновременно.',
  costLabel: '1,500 лв',
  costSub: 'на месец + осигуровки',
  features: [
    { label: 'Работно време', value: 23, displayValue: '8ч / 5 дни', icon: Clock },
    { label: 'Едновременни разговори', value: 5, displayValue: '1 разговор', icon: Phone },
    { label: 'Наличност', value: 20, displayValue: 'Работни часове', icon: Calendar },
    { label: 'Мащабируемост', value: 5, displayValue: 'Невъзможна', icon: Users },
    { label: 'Езици', value: 10, displayValue: '1–2 езика', icon: Globe },
    { label: 'Отпуски', value: 100, displayValue: 'Платени', icon: Coffee },
  ],
};

const AI_SIDE: SideData = {
  id: 'ai',
  subtitle: 'AI Рецепционист',
  title: 'Анна',
  description:
    'Отговаря на неограничен брой разговори едновременно, 24/7/365 — без болнични, без отпуски, без допълнителни разходи.',
  costLabel: '79 лв',
  costSub: 'на месец. Всичко включено.',
  features: [
    { label: 'Работно време', value: 100, displayValue: '24 / 7 / 365', icon: Clock },
    { label: 'Едновременни разговори', value: 100, displayValue: 'Неограничени', icon: Phone },
    { label: 'Наличност', value: 100, displayValue: 'Винаги', icon: Calendar },
    { label: 'Мащабируемост', value: 100, displayValue: 'Неограничена', icon: Users },
    { label: 'Езици', value: 90, displayValue: 'Множество езици', icon: Globe },
    { label: 'Отпуски', value: 0, displayValue: 'Никога', icon: Zap },
  ],
};

// =========================================
// ANIMATIONS
// =========================================

const containerAnim = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 110, damping: 20 },
  },
};

// =========================================
// VISUAL — TRADITIONAL (icon circle)
// =========================================

const TraditionalVisual = () => (
  <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 md:mb-10">
    <div
      className="absolute inset-0 rounded-full border border-dashed border-obsidian-900/10"
      style={{ animation: 'spin 28s linear infinite' }}
    />
    <div
      className="absolute inset-4 rounded-full blur-2xl bg-obsidian-900/5"
      style={{ animation: 'visual-pulse 4.5s ease-in-out infinite' }}
    />
    <div className="relative z-10 w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-obsidian-900/10 overflow-hidden">
      <img
        src="/imagespfp/Untitled%20design%20(73).png"
        alt="Традиционен рецепционист"
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  </div>
);

// =========================================
// VISUAL — AI (icon circle)
// =========================================

const AIVisual = () => (
  <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 md:mb-10">
    <div
      className="absolute inset-0 rounded-full border border-dashed border-accent-blue/25"
      style={{ animation: 'spin 10s linear infinite' }}
    />
    <div
      className="absolute inset-4 rounded-full blur-2xl bg-accent-blue/15"
      style={{ animation: 'visual-pulse 2.5s ease-in-out infinite' }}
    />
    <div className="relative z-10 w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-accent-blue/30 overflow-hidden">
      <img
        src="/imagespfp/smiliebot.png"
        alt="Анна AI"
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  </div>
);

// =========================================
// METRIC BARS
// =========================================

const MetricBar = ({
  feature,
  isAI,
  delay,
  inView,
}: {
  feature: FeatureMetric;
  isAI: boolean;
  delay: number;
  inView: boolean;
  key?: string | number;
}) => {
  const isPositiveZero = isAI && feature.value === 0;
  const barWidth = isPositiveZero ? 100 : feature.value;
  const barColor = isAI ? 'bg-accent-blue' : 'bg-obsidian-900/20';

  return (
    <div className="space-y-1.5">
      <div className={`flex items-center justify-between text-xs ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <div
          className={`flex items-center gap-1.5 font-display font-bold uppercase tracking-wider ${isAI ? 'text-obsidian-900/50' : 'text-obsidian-900/25'
            }`}
        >
          <feature.icon size={12} />
          <span>{feature.label}</span>
        </div>
        <span
          className={`font-display font-black text-xs ${isAI ? 'text-accent-blue' : 'text-obsidian-900/25 line-through'
            }`}
        >
          {feature.displayValue}
        </span>
      </div>
      <div className="relative h-1 w-full bg-obsidian-900/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${barWidth}%` : 0 }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-0 bottom-0 rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
};

// =========================================
// SIDE PANEL
// =========================================

const SidePanel = ({ side, inView }: { side: SideData; inView: boolean }) => {
  const isAI = side.id === 'ai';

  return (
    <motion.div
      variants={containerAnim}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`flex flex-col ${isAI ? 'items-end text-right' : 'items-start text-left'} w-full`}
    >
      {/* Subtitle */}
      <motion.p
        variants={itemAnim}
        className={`text-xs font-display font-bold uppercase tracking-[0.25em] mb-2 ${isAI ? 'text-accent-blue' : 'text-obsidian-900/30'
          }`}
      >
        {side.subtitle}
      </motion.p>

      {/* Title */}
      <motion.h3
        variants={itemAnim}
        className={`font-display text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-3 ${isAI ? 'text-obsidian-900' : 'text-obsidian-900/25'
          }`}
      >
        {side.title}
      </motion.h3>

      {/* Cost */}
      <motion.div
        variants={itemAnim}
        className={`inline-flex flex-col ${isAI ? 'items-end' : 'items-start'} mb-5`}
      >
        <span
          className={`font-display text-3xl md:text-4xl font-black tracking-tight ${isAI ? 'text-accent-blue' : 'text-obsidian-900/25 line-through'
            }`}
        >
          {side.costLabel}
        </span>
        <span
          className={`text-xs font-display font-bold uppercase tracking-widest ${isAI ? 'text-accent-blue/50' : 'text-obsidian-900/20'
            }`}
        >
          {side.costSub}
        </span>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={itemAnim}
        className={`text-sm leading-relaxed mb-6 max-w-xs ${isAI ? 'text-obsidian-900/60 ml-auto' : 'text-obsidian-900/30 mr-auto'
          }`}
      >
        {side.description}
      </motion.p>

      {/* Visual */}
      <motion.div variants={itemAnim} className="w-full">
        {isAI ? <AIVisual /> : <TraditionalVisual />}
      </motion.div>

      {/* Metrics card */}
      <motion.div
        variants={itemAnim}
        className={`w-full space-y-4 p-5 rounded-2xl border ${isAI
          ? 'border-accent-blue/15 bg-accent-blue/5'
          : 'border-obsidian-900/8 bg-obsidian-900/3'
          }`}
      >
        {side.features.map((feature, idx) => (
          <MetricBar
            key={feature.label}
            feature={feature}
            isAI={isAI}
            delay={0.25 + idx * 0.1}
            inView={inView}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// =========================================
// CENTER DIVIDER
// =========================================

const CenterDivider = ({
  inView,
  hoveredSide,
}: {
  inView: boolean;
  hoveredSide: 'traditional' | 'ai' | null;
}) => (
  <div className="hidden md:flex flex-col items-center gap-4 shrink-0 pt-24">
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={
        inView
          ? {
            opacity: 1,
            scale: hoveredSide ? 1.15 : 1,
            borderColor:
              hoveredSide === 'ai'
                ? 'rgba(0,68,255,0.4)'
                : hoveredSide === 'traditional'
                  ? 'rgba(10,10,10,0.25)'
                  : 'rgba(10,10,10,0.15)',
            boxShadow:
              hoveredSide === 'ai'
                ? '0 0 16px 2px rgba(0,68,255,0.15)'
                : 'none',
          }
          : {}
      }
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-12 h-12 rounded-full border-2 border-obsidian-900/15 bg-white flex items-center justify-center shadow-sm"
    >
      <motion.span
        animate={{
          color:
            hoveredSide === 'ai'
              ? 'rgba(0,68,255,0.7)'
              : 'rgba(10,10,10,0.4)',
        }}
        transition={{ duration: 0.3 }}
        className="font-display font-black text-xs uppercase tracking-wider"
      >
        vs
      </motion.span>
    </motion.div>
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={inView ? { scaleY: 1, opacity: 1 } : {}}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'top' }}
      className="w-px flex-1 bg-gradient-to-b from-obsidian-900/20 via-obsidian-900/8 to-transparent"
    />
  </div>
);

// =========================================
// MAIN COMPONENT
// =========================================

const ReceptionistComparison: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' });
  const [hoveredSide, setHoveredSide] = useState<'traditional' | 'ai' | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const sideTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] };

  return (
    <section
      ref={sectionRef}
      className={`py-24 md:py-40 bg-white text-obsidian-900 overflow-hidden${!isOnScreen ? ' rc-paused' : ''}`}
    >
      <style>{`
        @keyframes visual-pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.12); opacity: 0.35; }
        }
        .rc-paused * { animation-play-state: paused !important; }
      `}</style>
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-accent-blue">
            Виж<br />Разликата.
          </h2>
          <p className="text-xl md:text-2xl font-medium max-w-sm text-obsidian-900/60">
            Традиционен рецепционист срещу Анна — интелигентният AI асистент.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-4 lg:gap-10 w-full">

          {/* Traditional side */}
          <motion.div
            className="w-full md:flex-1 cursor-default"
            onHoverStart={() => setHoveredSide('traditional')}
            onHoverEnd={() => setHoveredSide(null)}
            animate={{
              opacity: hoveredSide === 'ai' ? 0.6 : 1,
              scale: hoveredSide === 'traditional' ? 1.012 : 1,
            }}
            transition={sideTransition}
          >
            <SidePanel side={TRADITIONAL} inView={inView} />
          </motion.div>

          <CenterDivider inView={inView} hoveredSide={hoveredSide} />

          {/* AI side */}
          <motion.div
            className="w-full md:flex-1 cursor-default"
            onHoverStart={() => setHoveredSide('ai')}
            onHoverEnd={() => setHoveredSide(null)}
            animate={{
              opacity: hoveredSide === 'traditional' ? 0.6 : 1,
              scale: hoveredSide === 'ai' ? 1.012 : 1,
            }}
            transition={sideTransition}
          >
            <SidePanel side={AI_SIDE} inView={inView} />
          </motion.div>

        </div>

        {/* Mobile VS badge */}
        <div className="flex md:hidden items-center gap-4 my-8">
          <div className="flex-1 h-px bg-obsidian-900/10" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-obsidian-900/30 px-3 py-1.5 border border-obsidian-900/10 rounded-full">
            vs
          </span>
          <div className="flex-1 h-px bg-obsidian-900/10" />
        </div>

        {/* Summary callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-accent-blue/15 bg-accent-blue/5"
        >
          <div className="flex items-center gap-4">
            <BadgeCheck size={32} className="text-accent-blue shrink-0" strokeWidth={1.5} />
            <p className="text-lg font-medium text-obsidian-900/70 max-w-lg">
              Анна поема всички обаждания от деня, в който я активирате — без обучение, без отпуски, без разходи за HR.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="font-display text-3xl font-black text-accent-blue tracking-tight">95%</p>
              <p className="text-xs font-display font-bold uppercase tracking-widest text-obsidian-900/40">по-ниска цена</p>
            </div>
            <div className="w-px h-10 bg-obsidian-900/10" />
            <div className="text-right">
              <p className="font-display text-3xl font-black text-accent-blue tracking-tight">∞</p>
              <p className="text-xs font-display font-bold uppercase tracking-widest text-obsidian-900/40">капацитет</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ReceptionistComparison;
