import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CursorGlow from './components/CursorGlow';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import Timeline from './components/Timeline';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('main'); // 'main' | 'admin'
  const [activeSection, setActiveSection] = useState('home');

  // Track active section on scroll
  useEffect(() => {
    if (view !== 'main') return;

    const sections = ['home', 'about', 'skills', 'portfolio', 'services', 'process', 'pricing', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for sticky nav

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  return (
    <>
      {/* 1. Cinematic Shutter Loading Screen */}
      <LoadingScreen onComplete={() => setLoading(false)} />

      {!loading && (
        <div className="relative min-h-screen bg-[#050505] text-white flex flex-col justify-between">
          {/* 2. Interactive Cursor Glow Follower */}
          <CursorGlow />

          {/* 3. Global Sticky Header */}
          <Navbar 
            activeSection={activeSection} 
            currentView={view} 
            setView={setView} 
          />

          {/* 4. Main Body Content Switcher */}
          <main className="flex-grow z-10">
            {view === 'admin' ? (
              <AdminDashboard />
            ) : (
              <>
                <Hero />
                <About />
                <Skills />
                <Portfolio />
                <Services />
                <Timeline />
                <Pricing />
                <Contact />

                {/* Floating WhatsApp Quick Connect Widget */}
                <a
                  href="https://wa.me/918287341059?text=Hi%20Navneet%2C%20I%27d%20love%20to%20hire%20you%20for%20a%20project!"
                  target="_blank"
                  rel="noreferrer"
                  className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-110 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 group"
                  title="Chat on WhatsApp"
                >
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.216 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-emerald-400 border-2 border-[#050505] animate-pulse" />
                </a>
              </>
            )}
          </main>

          {/* 5. Sticky/Clean Global Footer */}
          <Footer />
        </div>
      )}
    </>
  );
}
