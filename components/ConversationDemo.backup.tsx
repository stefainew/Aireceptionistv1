import React, { useState, useEffect } from 'react';

type Message = {
  role: 'user' | 'ai';
  text: string;
  intent?: string;
  data?: string;
};

const conversationSequence: Message[] = [
  {
    role: 'user',
    text: "Здравейте, искам да запазя час за д-р Иванов."
  },
  {
    role: 'ai',
    text: "Здравейте! Разбира се. Д-р Иванов има свободен час този четвъртък в 14:30 или в петък сутринта в 09:15. Кое ви е по-удобно?",
    intent: "НАМЕРЕНИЕ: Запазване на час",
    data: "СУБЕКТ: Д-р Иванов"
  },
  {
    role: 'user',
    text: "Петък сутринта е добре. Колко струва прегледът?"
  },
  {
    role: 'ai',
    text: "Чудесно, записах ви за петък, 09:15. Първичният преглед е 50 лв. Имате ли други въпроси?",
    intent: "ДЕЙСТВИЕ: Събитие в Календар",
    data: "ПОТВЪРДЕНО: Петък @ 09:15"
  },
  {
    role: 'user',
    text: "Не, това е всичко. Благодаря!"
  },
  {
    role: 'ai',
    text: "Благодаря ви! Желая ви хубав ден.",
    intent: "СТАТУС: Разговорът приключи",
    data: "ЛОГ: SMS Изпратен"
  }
];

const ConversationDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    let timeout: any;

    const runSequence = () => {
      if (step < conversationSequence.length) {
        // Simulate "Thinking" time before AI speaks
        const currentMessage = conversationSequence[step];
        const isAI = currentMessage.role === 'ai';

        if (isAI && !isThinking) {
          setIsThinking(true);
          timeout = setTimeout(() => {
            setIsThinking(false);
            setStep(s => s + 1);
          }, 800); // Thinking delay
        } else {
          timeout = setTimeout(() => {
            setStep(s => s + 1);
          }, isAI ? 2500 : 1500); // Reading time
        }
      } else {
        // Reset loop
        timeout = setTimeout(() => {
          setStep(0);
        }, 3000);
      }
    };

    runSequence();
    return () => clearTimeout(timeout);
  }, [step, isThinking]);

  return (
    <section id="logic-demo" className="pb-24 pt-12 md:pb-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">

        <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-16 max-w-4xl pt-16 border-t-2 border-white/20">
          Интелектът <br /> зад гласа.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">

          {/* Transcript Area - Brutalist Layout */}
          <div className="space-y-12">
            <div className="uppercase tracking-[0.2em] text-xs font-bold opacity-50 mb-8 border-b border-white/20 pb-4">
              Транскрипция на живо
            </div>

            <div className="space-y-8">
              {conversationSequence.slice(0, step).map((msg, idx) => (
                <div key={idx} className={`animate-in slide-in-from-bottom-4 duration-500`}>
                  <div className={`font-display uppercase tracking-widest text-xs font-bold mb-2 ${msg.role === 'ai' ? 'text-obsidian-900 bg-white inline-block px-2' : 'text-white/50'}`}>
                    {msg.role === 'ai' ? 'AI Рецепционист' : 'Клиент'}
                  </div>
                  <div className={`text-2xl md:text-4xl font-medium leading-tight tracking-tight ${msg.role === 'ai' ? 'text-white' : 'text-white/70 italic'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="animate-in fade-in flex flex-col items-start gap-4">
                  <div className="font-display uppercase tracking-widest text-xs font-bold text-obsidian-900 bg-white inline-block px-2 animate-pulse">
                    AI Рецепционист
                  </div>
                  <div className="flex gap-2 items-center text-4xl mt-2">
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Neural Process / Logic Card */}
          <div className="lg:border-l-2 border-white/20 lg:pl-12 pt-12 lg:pt-0">
            <div className="uppercase tracking-[0.2em] text-xs font-bold opacity-50 mb-8 border-b border-white/20 pb-4">
              Мозъчен процес
            </div>

            <div className="sticky top-32 space-y-8 font-mono">
              {step > 0 ? (
                conversationSequence.slice(0, step).filter(m => m.role === 'ai').slice(-1).map((msg, i) => (
                  <div key={i} className="animate-in fade-in duration-300">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                      {msg.intent || "ОБРАБОТКА..."}
                    </p>
                    <div className="border-l-4 border-white pl-6 text-xl text-white/70">
                      &gt; {msg.data || "Анализ на контекста и извличане на векторни данни..."}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-2xl text-white/50 uppercase tracking-widest animate-pulse">
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