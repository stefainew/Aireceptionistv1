import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        q: "Звучи ли като робот?",
        a: "Не. Използваме най-новите модели за синтез на реч, които включват 'аха', паузи за дишане, промяна в интонацията и разбират контекст. Над 95% от клиентите не разбират, че разговарят с изкуствен интелект."
    },
    {
        q: "Ако не знае отговора?",
        a: "Ако срещне въпрос извън базата знания, системата учтиво ще предложи да прехвърли обаждането или да запише съобщение, което получавате веднага."
    },
    {
        q: "Собствен глас?",
        a: "Абсолютно. Можем да клонираме вашия глас или гласа на ваш служител за създаване на уникално и лично преживяване."
    },
    {
        q: "Трудно ли е внедряването?",
        a: "Отнема под 30 минути. Ние настройваме всичко. Вие просто пренасочвате обажданията към новия номер."
    },
    {
        q: "Връзка с календар?",
        a: "Да. Интегрираме директно Google Calendar, Calendly, и повечето CRM системи. Записаните часове се появяват автоматично."
    },
    {
        q: "Договор и такси?",
        a: "Няма дългосрочни договори. Плащате месец за месец. Без скрити такси за инсталация."
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 md:py-40 bg-transparent text-offwhite border-b-2 border-white/20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 lg:gap-24">

                <div className="w-full lg:w-1/3">
                    <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none sticky top-32 text-accent-blue">
                        Ясни<br />Отговори.
                    </h2>
                </div>

                <div className="w-full lg:w-2/3 flex flex-col">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b-2 border-white/20 group">
                            <button
                                className="w-full flex items-center justify-between py-8 md:py-12 text-left transition-colors focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className={`font-display text-3xl md:text-5xl font-bold uppercase tracking-tight transition-colors ${openIndex === index ? 'text-accent-blue' : 'text-white opacity-60 group-hover:opacity-100'}`}>
                                    {faq.q}
                                </span>
                                <div className={`ml-8 shrink-0 transition-transform duration-500 ${openIndex === index ? 'rotate-180 text-accent-blue' : 'text-white opacity-60 group-hover:opacity-100'}`}>
                                    {openIndex === index ? <Minus className="w-8 h-8 md:w-12 md:h-12" /> : <Plus className="w-8 h-8 md:w-12 md:h-12" />}
                                </div>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="text-xl md:text-3xl font-medium leading-relaxed opacity-80 pl-4 md:pl-8 border-l-4 border-accent-blue">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FAQ;
