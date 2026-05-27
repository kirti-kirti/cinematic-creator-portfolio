import React from 'react';
import { Film, Instagram, Youtube, Linkedin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/navneet_kushwaha_19', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@travelwithnavneet4553', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com/in/navneet', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative bg-[#020202] border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-2 font-display font-bold text-lg tracking-wider text-white">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-tr from-accent-orange to-accent-violet">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <span>NAVNEET<span className="text-accent-orange">.</span></span>
          </div>
          <p className="text-[10px] font-mono text-white/40 tracking-wider uppercase mt-1">
            TURNING MOMENTS INTO CINEMATIC STORIES
          </p>
        </div>

        {/* Social Icons row */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="w-10 h-10 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-accent-orange/30 flex items-center justify-center text-white/60 hover:text-accent-orange transition-all duration-300 group"
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            );
          })}
        </div>

        {/* Copyright info & scroll back */}
        <div className="flex items-center gap-6">
          <div className="text-[11px] font-mono text-white/30 text-center md:text-right uppercase tracking-wider">
            &copy; {currentYear} Navneet Films. All rights reserved.
          </div>
          
          <button
            onClick={handleScrollToTop}
            className="w-9 h-9 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
