import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import AudioScrollDemo from './components/AudioScrollDemo';
import ConversationDemo from './components/ConversationDemo';
import Features from './components/Features';
import ComparisonTable from './components/ComparisonTable';
import ReceptionistComparison from './components/ReceptionistComparison';
import GoodnessMission from './components/GoodnessMission';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import BookingSection from './components/BookingSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const appRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      document.body.classList.add('selection:bg-accent-blue', 'selection:text-white', 'transition-colors', 'duration-700');
    }, appRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={appRef} className="min-h-screen overflow-x-hidden font-sans">
      <div className="relative z-10 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Hero />

          <div className="theme-dark bg-obsidian-900 text-offwhite flex flex-col">
            <ProblemSection />
          </div>

          {/* Scroll Animation + Audio Demo (self-contained dark bg) */}
          <AudioScrollDemo />

          <div className="theme-accent bg-accent-blue text-white flex flex-col">
            <ConversationDemo />
          </div>

          <div className="theme-dark bg-obsidian-900 text-offwhite flex flex-col">
            <Features />
            <ComparisonTable />
            <ReceptionistComparison />
            <GoodnessMission />
            <Testimonials />
            <FAQ />
            <BookingSection />
          </div>
        </main>
        <div className="bg-obsidian-900 text-offwhite">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
