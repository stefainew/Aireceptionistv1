import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Демо', href: '#demo' },
    { name: 'Сравнение', href: '#comparison' },
    { name: 'Контакти', href: '#booking' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
          ? 'bg-offwhite text-obsidian-900 border-obsidian-900 py-4'
          : 'bg-transparent text-obsidian-900 border-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 font-display uppercase tracking-widest font-black text-xl cursor-pointer hover:opacity-70 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="bg-obsidian-900 text-offwhite px-2 py-0.5 mr-1">AI</span> Receptionist
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-display uppercase tracking-wider text-sm font-bold">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href.replace('#', ''))}
              className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-obsidian-900 after:transition-all hover:after:w-full"
            >
              {link.name}
            </a>
          ))}

          <button
            onClick={(e) => scrollToSection(e, 'booking')}
            className="px-6 py-2 border-2 border-obsidian-900 bg-obsidian-900 text-offwhite hover:bg-transparent hover:text-obsidian-900 transition-colors duration-300 cursor-pointer"
          >
            Запази час
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-offwhite border-b-2 border-obsidian-900 p-8 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-5 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-display uppercase tracking-widest text-2xl font-bold border-b border-obsidian-200 pb-4"
              onClick={(e) => scrollToSection(e, link.href.replace('#', ''))}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={(e) => scrollToSection(e, 'booking')}
            className="w-full text-center py-4 bg-obsidian-900 text-offwhite font-display uppercase tracking-widest font-bold mt-4"
          >
            Запази час
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
