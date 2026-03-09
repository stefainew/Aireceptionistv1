import React from 'react';

const Footer: React.FC = () => {
  const handleDemoLink = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    alert(`Това е демо линк за страницата "${name}". В реална среда тук ще се зареди съответната информация.`);
  };

  return (
    <footer className="bg-obsidian-900 border-t-2 border-white/20 pt-24 pb-12 text-offwhite">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h1 className="font-display text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-4">
              Анна.
            </h1>
            <p className="text-xl md:text-2xl font-medium opacity-80 uppercase tracking-widest">
              AI Рецепционистът<br />на бъдещето.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-lg md:text-xl font-medium uppercase tracking-widest opacity-80">
            <a href="#" onClick={(e) => handleDemoLink(e, "Политика за поверителност")} className="hover:text-accent-blue transition-colors">Политика за поверителност</a>
            <a href="#" onClick={(e) => handleDemoLink(e, "Общи условия")} className="hover:text-accent-orange transition-colors">Общи условия</a>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8 border-t-2 border-white/20 opacity-50 text-sm font-bold uppercase tracking-widest">
          <p>© 2024 Всички права запазени.</p>
          <p className="hidden md:block uppercase">Дизайн & Разработка</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
