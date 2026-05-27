import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Film, Lock } from 'lucide-react';

export default function Navbar({ activeSection, currentView, setView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setView('main');
    setIsOpen(false);
    
    const target = document.querySelector(href);
    if (target) {
      const offset = 80; // height of sticky nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex items-center gap-2 font-display font-bold text-xl tracking-wider text-white group"
        >
          <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-tr from-accent-orange to-accent-violet group-hover:scale-105 transition-transform duration-300">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span>NAVNEET<span className="text-accent-orange">.</span></span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const active = currentView === 'main' && activeSection === link.href.substring(1);
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`relative py-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
                      active ? 'text-accent-orange' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-orange"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Admin Switcher Button */}
          <button
            onClick={() => setView(currentView === 'admin' ? 'main' : 'admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-widest border transition-all duration-300 ${
              currentView === 'admin'
                ? 'bg-accent-orange/20 border-accent-orange text-accent-orange hover:bg-accent-orange/30'
                : 'border-white/10 text-white/80 hover:border-white/30 hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {currentView === 'admin' ? 'EXIT DASHBOARD' : 'ADMIN PANEL'}
          </button>
        </nav>

        {/* Mobile Burger Trigger */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setView(currentView === 'admin' ? 'main' : 'admin')}
            className={`p-2 rounded-lg border border-white/5 transition-colors ${
              currentView === 'admin' ? 'text-accent-orange bg-accent-orange/10' : 'text-white/60'
            }`}
            title="Admin Login"
          >
            <Lock className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-[#0a0a0c] border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const active = currentView === 'main' && activeSection === link.href.substring(1);
                  return (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className={`block text-base font-medium tracking-wide py-1 ${
                          active ? 'text-accent-orange' : 'text-white/70'
                        }`}
                      >
                        {link.name}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="h-[1px] w-full bg-white/5" />

              <button
                onClick={() => {
                  setView(currentView === 'admin' ? 'main' : 'admin');
                  setIsOpen(false);
                }}
                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-mono tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Lock className="w-4 h-4" />
                {currentView === 'admin' ? 'Exit Dashboard' : 'Access Admin Dashboard'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
