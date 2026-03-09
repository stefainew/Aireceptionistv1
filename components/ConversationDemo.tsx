import React, { useState, useEffect, useRef } from 'react';

type Message = {
  role: 'user' | 'ai';
  text: string;
  intent?: string;
  intentLabel?: string;
  data?: string;
  dataLabel?: string;
};

const conversationSequence: Message[] = [
  {
    role: 'user',
    text: "Здравейте, искам да запазя час за д-р Иванов."
  },
  {
    role: 'ai',
    text: "Здравейте! Разбира се. Д-р Иванов има свободен час този четвъртък в 14:30 или в петък сутринта в 09:15. Кое ви е по-удобно?",
    intentLabel: "НАМЕРЕНИЕ",
    intent: "Запазване на час",
    dataLabel: "СУБЕКТ",
    data: "Д-р Иванов"
  },
  {
    role: 'user',
    text: "Петък сутринта е добре. Колко струва прегледът?"
  },
  {
    role: 'ai',
    text: "Чудесно, записах ви за петък, 09:15. Първичният преглед е 50 лв. Имате ли други въпроси?",
    intentLabel: "ДЕЙСТВИЕ",
    intent: "Събитие в Календар",
    dataLabel: "ПОТВЪРДЕНО",
    data: "Петък @ 09:15"
  },
  {
    role: 'user',
    text: "Не, това е всичко. Благодаря!"
  },
  {
    role: 'ai',
    text: "Благодаря ви! Желая ви хубав ден.",
    intentLabel: "СТАТУС",
    intent: "Разговорът приключи",
    dataLabel: "ЛОГ",
    data: "SMS Изпратен"
  }
];

// Tokens to float toward the brain panel when AI is thinking
const tokenMap: Record<number, string[]> = {
  1: ["Д-р Иванов", "запазване", "час", "четвъртък"],
  3: ["петък", "09:15", "50 лв", "потвърждение"],
  5: ["приключи", "SMS", "лог"],
};

const WaveBar: React.FC<{ delay: string; height: string }> = ({ delay, height }) => (
  <span
    className="inline-block w-[3px] rounded-full bg-green-400"
    style={{
      height,
      animation: `wave 1.2s ease-in-out infinite`,
      animationDelay: delay,
    }}
  />
);

const ConversationDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Which AI step index is currently being "thought about"
  const thinkingStepIndex = step < conversationSequence.length ? step : 0;

  // Start/stop based on scroll visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setStep(0);
          setIsThinking(false);
          setProgress(0);
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let timeout: any;
    let progressInterval: any;

    const runSequence = () => {
      if (step < conversationSequence.length) {
        const currentMessage = conversationSequence[step];
        const isAI = currentMessage.role === 'ai';

        if (isAI && !isThinking) {
          setIsThinking(true);
          setProgress(0);
          progressInterval = setInterval(() => {
            setProgress(p => Math.min(p + 12, 90));
          }, 80);
          timeout = setTimeout(() => {
            clearInterval(progressInterval);
            setProgress(100);
            setIsThinking(false);
            setStep(s => s + 1);
          }, 800);
        } else {
          timeout = setTimeout(() => {
            setProgress(0);
            setStep(s => s + 1);
          }, isAI ? 2500 : 1500);
        }
      } else {
        timeout = setTimeout(() => {
          setStep(0);
          setProgress(0);
        }, 3000);
      }
    };

    runSequence();
    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [step, isThinking, isVisible]);

  const visibleMessages = conversationSequence.slice(0, step);
  const lastAiMessage = [...visibleMessages].reverse().find(m => m.role === 'ai');
  const floatingTokens = isThinking ? (tokenMap[thinkingStepIndex] ?? []) : [];

  return (
    <section ref={sectionRef} id="logic-demo" className={`pb-24 pt-12 md:pb-32 relative overflow-hidden${!isVisible ? ' cd-paused' : ''}`}>
      <style>{`
        @keyframes float-chip {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.8); }
          15%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { opacity: 0; transform: translate(180px, -140px) scale(1.05); }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50%       { transform: scaleY(1); }
        }
        @keyframes stream-down {
          0%   { top: -8px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes ring-pulse {
          0%, 100% { opacity: 0.05; }
          50%       { opacity: 0.10; }
        }
        .cd-paused * { animation-play-state: paused !important; }
      `}</style>

      {/* ── Background Graphics ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
        }} />
        {/* Glow blob — top right */}
        <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-white/10 blur-[160px]" />
        {/* Glow blob — bottom left */}
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-white/6 blur-[140px]" />
        {/* Concentric sound-wave rings — voice/signal watermark */}
        <svg
          className="absolute -top-16 -right-16 w-[560px] h-[560px]"
          viewBox="0 0 400 400" fill="none"
          style={{ animation: 'ring-pulse 4s ease-in-out infinite' }}
        >
          {[60, 110, 160, 210, 260, 310].map((r, i) => (
            <circle key={i} cx="380" cy="20" r={r} stroke="white" strokeWidth="1" opacity={0.9 - i * 0.12} />
          ))}
        </svg>
        {/* Large ghost label */}
        <span className="absolute bottom-0 right-6 font-display font-black text-[160px] md:text-[220px] uppercase leading-none text-white/[0.04] select-none tracking-tighter">
          AI
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">

        {/* Voice Agent Identity Bar */}
        <div className="pt-16 border-t-2 border-white/20 mb-6 flex items-center gap-4">
          {/* LIVE badge */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">На живо</span>
          </div>

          {/* Waveform bars */}
          <div className="flex items-end gap-[3px] h-5">
            <WaveBar delay="0s"    height="6px"  />
            <WaveBar delay="0.15s" height="14px" />
            <WaveBar delay="0.3s"  height="10px" />
            <WaveBar delay="0.1s"  height="18px" />
            <WaveBar delay="0.25s" height="8px"  />
            <WaveBar delay="0.4s"  height="14px" />
            <WaveBar delay="0.05s" height="6px"  />
          </div>

          <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/50">
            Гласов AI Рецепционист
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-16 max-w-4xl">
          Интелектът <br /> зад гласа.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">

          {/* LEFT: Apple-style chat bubbles */}
          <div className="space-y-4 relative">
            <div className="uppercase tracking-[0.2em] text-xs font-bold opacity-50 mb-8 border-b border-white/20 pb-4">
              Транскрипция на живо
            </div>

            <div className="space-y-3">
              {visibleMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`animate-in slide-in-from-bottom-4 duration-500 flex flex-col ${msg.role === 'ai' ? 'items-end' : 'items-start'}`}
                >
                  <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${msg.role === 'ai' ? 'text-white/40' : 'text-white/30'}`}>
                    {msg.role === 'ai' ? 'AI Рецепционист' : 'Клиент'}
                  </span>
                  <div
                    className={`max-w-[85%] px-5 py-4 text-xl md:text-2xl leading-snug font-medium ${
                      msg.role === 'ai'
                        ? 'bg-[#0044FF] text-white rounded-3xl rounded-br-sm shadow-[0_4px_20px_rgba(0,68,255,0.35)]'
                        : 'bg-white/10 text-white/80 rounded-3xl rounded-bl-sm italic border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="animate-in fade-in flex flex-col items-end">
                  <span className="text-xs font-bold uppercase tracking-widest mb-1 text-white/40 animate-pulse">
                    AI Рецепционист
                  </span>
                  <div className="bg-[#0044FF]/70 rounded-3xl rounded-br-sm px-6 py-4 flex gap-2 items-center">
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Token Chips */}
            {floatingTokens.length > 0 && (
              <div className="hidden md:block absolute bottom-8 left-0 w-full pointer-events-none" aria-hidden="true">
                {floatingTokens.map((token, i) => (
                  <span
                    key={`${thinkingStepIndex}-${i}`}
                    className="absolute font-mono text-sm font-semibold px-3 py-1.5 rounded-full border border-[#0044FF]/60 bg-[#0044FF]/15 text-white/90 backdrop-blur-sm"
                    style={{
                      left: `${10 + i * 18}%`,
                      bottom: `${i * 14}px`,
                      animation: `float-chip 1.4s ease-in-out forwards`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  >
                    {token}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: NLP Brain Panel */}
          <div className="lg:border-l-2 border-white/20 lg:pl-12 pt-12 lg:pt-0 relative">
            {/* Data stream dots flowing down the divider */}
            <div className="hidden lg:block absolute left-0 top-0 h-full w-0 overflow-visible pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <span
                  key={i}
                  className="absolute left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-white/80 shadow-[0_0_8px_4px_rgba(255,255,255,0.25)]"
                  style={{ animation: 'stream-down 2.8s linear infinite', animationDelay: `${i * 0.7}s` }}
                />
              ))}
            </div>
            <div className="uppercase tracking-[0.2em] text-xs font-bold opacity-50 mb-6 border-b border-white/20 pb-4">
              Мозъчен процес
            </div>

            {/* Progress bar */}
            <div className="h-[2px] bg-white/10 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="sticky top-32 font-mono space-y-6">
              {step > 0 && lastAiMessage ? (
                <div className="animate-in fade-in duration-300 space-y-5">
                  {/* Intent chip */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2 font-bold">
                      {lastAiMessage.intentLabel ?? "НАМЕРЕНИЕ"}
                    </p>
                    <span className="inline-block bg-white text-[#0044FF] text-2xl md:text-3xl font-black uppercase tracking-tight px-5 py-3 rounded-2xl rounded-bl-sm font-display">
                      {lastAiMessage.intent ?? "ОБРАБОТКА..."}
                    </span>
                  </div>

                  {/* Data chip */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2 font-bold">
                      {lastAiMessage.dataLabel ?? "ДАННИ"}
                    </p>
                    <span className="inline-block border border-white/30 bg-white/5 text-white/80 text-xl md:text-2xl font-semibold px-5 py-3 rounded-2xl rounded-bl-sm">
                      &gt; {lastAiMessage.data ?? "Анализ на контекста..."}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xl text-white/30 uppercase tracking-widest animate-pulse">
                  Очаква се връзка...
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ConversationDemo;
