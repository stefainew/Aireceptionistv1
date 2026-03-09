import React from 'react';

const testimonials = [
    {
        name: "Д-р Иван Петров",
        role: "Дентална клиника 'ДентЕстет'",
        text: "Преди губехме 15% от пациентите си. Сега графикът се пълни автоматично, дори през нощта.",
        stars: 5
    },
    {
        name: "Адв. Мария Георгиева",
        role: "Кантора Георгиева и Партньори",
        text: "Клиентите са впечатлени. Системата звучи изключително професионално и се справя със сложни запитвания.",
        stars: 5
    },
    {
        name: "Стефан Николов",
        role: "Автосервиз 'Скорост'",
        text: "Спестихме заплатата на един човек и увеличихме записаните часове с 30% още първия месец.",
        stars: 5
    }
];

const StarRating: React.FC<{ count: number }> = ({ count }) => (
    <div className="flex gap-1 mb-4">
        {Array.from({ length: count }).map((_, i) => (
            <svg key={i} className="w-5 h-5 text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const Testimonials: React.FC = () => {
    return (
        <section className="py-24 md:py-40 bg-transparent text-offwhite border-b-2 border-white/20">
            <div className="max-w-7xl mx-auto px-6">

                <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-24 max-w-4xl text-accent-blue">
                    Резултати.<br />Не обещания.
                </h2>

                <div className="flex flex-col gap-16 md:gap-32">
                    {testimonials.map((t, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">

                            <div className="w-full md:w-2/3">
                                <StarRating count={t.stars} />
                                <p className="font-display text-3xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-white">
                                    "{t.text}"
                                </p>
                            </div>

                            <div className="w-full md:w-1/3 flex flex-col md:text-right pt-2 md:pt-4 border-t-4 md:border-t-0 md:border-r-4 border-white/20 md:pr-8">
                                <div className="font-bold text-xl md:text-2xl uppercase tracking-widest">{t.name}</div>
                                <div className="text-white/60 font-medium text-lg mt-2">{t.role}</div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;