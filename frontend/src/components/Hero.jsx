import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Send, ChevronDown } from 'lucide-react';

export default function Hero() {
  const handleScrollTo = (id) => {
    const target = document.querySelector(id);
    if (target) {
      const offset = 80;
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
    <section 
      id="home" 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#020202]"
    >
      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505]/70 via-transparent to-[#050505]/70" />
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Cinematic Loop Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      >
        <source 
          src="https://player.vimeo.com/external/517618991.sd.mp4?s=d00cdbb1d5c2fa1296bf6d5a1b32d20387b3b646&profile_id=165&oauth2_token_id=57447761" 
          type="video/mp4" 
        />
        {/* Fallback image in case video fails to load */}
        Your browser does not support the video tag.
      </video>

      {/* Main Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/5 mb-6 text-xs md:text-sm font-mono tracking-widest text-accent-orange uppercase"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Now Accepting Bookings for 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="font-display font-extrabold text-5xl md:text-8xl tracking-tight text-white leading-none uppercase"
        >
          Turning Moments <br />
          Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-pink-500 to-accent-violet">Cinematic</span> Stories
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl mx-auto mt-6 text-base md:text-xl text-white/70 leading-relaxed font-light"
        >
          Hi, I'm <strong className="font-semibold text-white">Navneet</strong>. A professional video editor, photographer, and cinematic content creator crafting high-end commercials, viral social reels, and emotional wedding films.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => handleScrollTo('#portfolio')}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-mono text-xs tracking-widest font-semibold flex items-center justify-center gap-2 bg-[#0c0c10] hover:bg-[#14141c] text-white border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            VIEW PORTFOLIO
          </button>

          <a
            href="https://wa.me/918287341059?text=Hi%20Navneet%2C%20I%27d%20love%20to%20hire%20you%20for%20a%20project!"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-mono text-xs tracking-widest font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-accent-orange to-red-600 hover:from-accent-orange hover:to-red-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,87,34,0.4)]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.216 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            HIRE ME (WHATSAPP)
          </a>

          <button
            onClick={() => handleScrollTo('#contact')}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-mono text-xs tracking-widest font-semibold flex items-center justify-center gap-2 glass border border-white/10 hover:border-white/30 text-white transition-all duration-300 hover:scale-105 hover:bg-white/5"
          >
            <Send className="w-3.5 h-3.5" />
            CONTACT NAVNEET
          </button>
        </motion.div>
      </div>

      {/* Down Scroll Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
        onClick={() => handleScrollTo('#about')}
        className="absolute bottom-8 z-20 cursor-pointer flex flex-col items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors"
      >
        <span className="text-[10px] font-mono tracking-widest">SCROLL DOWN</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
