import React from 'react';
import { motion } from 'framer-motion';
import { Video, Camera, Sliders, Smartphone, Film, Award, Users, ShieldCheck } from 'lucide-react';

export default function About() {
  const specialties = [
    { icon: Video, title: 'Video Editing', desc: 'Crafting pacing and flow that hooks viewers.' },
    { icon: Film, title: 'Wedding Film Editing', desc: 'Capturing emotional Indian traditions and celebrations.' },
    { icon: Camera, title: 'Cinematic Shoots', desc: 'High-end brand shoots, clothing lines, and products.' },
    { icon: Sliders, title: 'Color Grading', desc: 'Transforming raw log profiles into cinematic mood.' },
    { icon: Smartphone, title: 'Instagram Reels', desc: 'Optimizing short-form edits for Indian creators.' },
    { icon: Users, title: 'Event Coverage', desc: 'Dynamic visual recaps of weddings & café launch nights.' }
  ];

  const stats = [
    { value: '250+', label: 'Projects Completed' },
    { value: '120+', label: 'Happy Clients' },
    { value: '400+', label: 'Reels Edited' },
    { value: '6+', label: 'Years Experience' }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#050505]">
      {/* Light glow leaks in background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center md:text-left mb-16">
          <span className="font-mono text-xs text-accent-orange tracking-widest uppercase">01 / WHO I AM</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mt-2">
            The Story Behind the Lens
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-orange to-accent-violet mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Profile Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            {/* Background frame styling */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-accent-orange/20 to-accent-violet/20 blur-xl opacity-60" />
            
            <div className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-[4/5] bg-dark-card">
              <img
                src={localStorage.getItem('profileImageUrl') || '/about-profile.jpg'}
                alt="Navneet Profile"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              {/* Image shutter-like overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white">Navneet</h4>
                    <p className="text-xs text-white/50">Founder, Director of Photography</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent-orange/10 flex items-center justify-center border border-accent-orange/30">
                    <div className="w-2.5 h-2.5 bg-accent-orange rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text/Specialties Column */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white/90 leading-snug">
              Creating Visual Art that Grabs Attention & Inspires.
            </h3>
            
            <p className="text-white/70 mt-6 leading-relaxed font-light">
              I’m a creator specializing in high-energy cinematic projects for the Indian market. I merge cinematography, video editing, and color science to build unique visual worlds. Whether it's crafting viral reels for influencers, editing premium wedding highlights, or producing commercials for cafes and clothing brands, my goal is always to deliver storytelling that stands out.
            </p>

            {/* Specialties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              {specialties.map((spec, i) => {
                const IconComponent = spec.icon;
                return (
                  <div 
                    key={spec.title} 
                    className="flex gap-4 p-4 rounded-xl border border-white/5 bg-dark-card/30 hover:border-white/10 hover:bg-dark-card/50 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent-orange/30 group-hover:bg-accent-orange/5 transition-all">
                      <IconComponent className="w-5 h-5 text-white/60 group-hover:text-accent-orange transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white group-hover:text-accent-orange transition-colors">{spec.title}</h4>
                      <p className="text-xs text-white/50 mt-1">{spec.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats list */}
            <div className="flex flex-wrap gap-8 items-center justify-around md:justify-start mt-12 pt-8 border-t border-white/5">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <div className="font-display font-bold text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-pink-500">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-white/40 tracking-wider mt-1 uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
