import React, { useState, useEffect, useRef } from 'react';
import { MoveRight, CheckCircle } from 'lucide-react';
import { BackgroundBeams } from './ui/background-beams';
import { supabase } from '../lib/supabase';

const BookingSection: React.FC = () => {
    const [formState, setFormState] = useState({
        name: '',
        phone: '',
        email: '',
        type: 'clinic'
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [beamsReady, setBeamsReady] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setBeamsReady(true);
                    observer.disconnect(); // mount once, never unmount
                }
            },
            { rootMargin: '200px' } // start loading 200px before section enters view
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await supabase.from('leads').insert({
            name: formState.name,
            phone: formState.phone,
            email: formState.email,
            business_type: formState.type,
        });

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormState({ name: '', phone: '', email: '', type: 'clinic' });
    };

    return (
        <section ref={sectionRef} id="booking" className="py-24 md:py-40 bg-transparent text-offwhite scroll-mt-32 relative overflow-hidden">
            {beamsReady && <BackgroundBeams />}
            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">

                <div className="w-full lg:w-1/2 flex flex-col">
                    <h2 className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none mb-8 text-accent-orange">
                        Старт.
                    </h2>
                    <p className="text-2xl md:text-4xl font-medium leading-tight mb-12 opacity-80 max-w-lg">
                        Заявете безплатна демонстрация и вижте как Анна ще промени бизнеса ви.
                    </p>

                    <div className="mt-auto hidden lg:block">
                        <div className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50">Какво следва?</div>
                        <div className="flex flex-col gap-6 text-xl font-medium">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full border-2 border-white/20 text-accent-orange flex items-center justify-center font-bold">1</span>
                                <span>15-минутна видео среща</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full border-2 border-white/20 text-accent-orange flex items-center justify-center font-bold">2</span>
                                <span>Реална демонстрация на живо</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full border-2 border-white/20 text-accent-orange flex items-center justify-center font-bold">3</span>
                                <span>Без ангажимент</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                            {/* Response time badge */}
                            <div className="flex items-center gap-2 self-start">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-orange"></span>
                                </span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/40">Отговаряме до 24 часа</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-display text-2xl font-bold uppercase tracking-tight text-white/50">Име</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-transparent border-b-4 border-white/20 hover:border-accent-orange focus:border-accent-orange text-3xl md:text-5xl font-medium py-4 outline-none transition-colors placeholder:text-white/20 rounded-none text-white"
                                    placeholder="Константин"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-display text-2xl font-bold uppercase tracking-tight text-white/50">Телефон</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-transparent border-b-4 border-white/20 hover:border-accent-orange focus:border-accent-orange text-3xl md:text-5xl font-medium py-4 outline-none transition-colors placeholder:text-white/20 rounded-none text-white"
                                    placeholder="0888..."
                                    value={formState.phone}
                                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-display text-2xl font-bold uppercase tracking-tight text-white/50">Имейл</label>
                                <input
                                    type="email"
                                    className="w-full bg-transparent border-b-4 border-white/20 hover:border-accent-orange focus:border-accent-orange text-3xl md:text-5xl font-medium py-4 outline-none transition-colors placeholder:text-white/20 rounded-none text-white"
                                    placeholder="info@..."
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-display text-2xl font-bold uppercase tracking-tight text-white/50">Бизнес</label>
                                <select
                                    className="w-full bg-transparent border-b-4 border-white/20 hover:border-accent-orange focus:border-accent-orange text-2xl md:text-4xl font-medium py-4 outline-none transition-colors appearance-none cursor-pointer rounded-none text-white"
                                    value={formState.type}
                                    onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                                    disabled={isSubmitting}
                                >
                                    <option value="clinic" className="bg-obsidian-900">Медицинска клиника</option>
                                    <option value="lawyer" className="bg-obsidian-900">Кантора</option>
                                    <option value="service" className="bg-obsidian-900">Услуги / Сервиз</option>
                                    <option value="realestate" className="bg-obsidian-900">Недвижими имоти</option>
                                    <option value="other" className="bg-obsidian-900">Друго</option>
                                </select>
                            </div>

                            <div className="mt-4 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative group w-full flex items-center justify-between p-8 border-4 border-accent-orange overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <span className="absolute inset-0 bg-accent-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>

                                    <span className="relative z-10 font-display text-3xl md:text-5xl font-black uppercase tracking-tighter group-hover:text-obsidian-900 transition-colors duration-500 text-offwhite">
                                        {isSubmitting ? "Изпращане..." : "Заяви Демо"}
                                    </span>

                                    <div className="relative z-10 text-offwhite group-hover:text-obsidian-900 transition-colors duration-500">
                                        <MoveRight className="w-12 h-12 md:w-16 md:h-16 group-hover:translate-x-4 transition-transform duration-500" />
                                    </div>
                                </button>

                                {/* Trust row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {['К', 'М', 'Г'].map((initial, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-obsidian-900 bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-xs font-bold text-white/70">
                                                    {initial}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium text-white/30">+120 клиента тази година</span>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/20">Безплатно</span>
                                </div>
                            </div>

                        </form>
                    ) : (
                        <div className="flex flex-col h-full items-start justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <CheckCircle className="w-24 h-24 mb-8 text-accent-orange" />
                            <h3 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white">
                                Готово.
                            </h3>
                            <p className="text-2xl md:text-3xl font-medium opacity-80 mb-12 text-white">
                                Очаквайте нашето обаждане скоро.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="font-bold text-xl uppercase tracking-widest border-b-2 border-accent-orange text-accent-orange hover:opacity-50 transition-opacity"
                            >
                                Нова заявка
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default BookingSection;
