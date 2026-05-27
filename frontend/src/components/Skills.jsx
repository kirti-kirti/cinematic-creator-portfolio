import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Image, Aperture, Layers, Paintbrush, SlidersHorizontal, Eye, Video, Film } from 'lucide-react';

export default function Skills() {
  const skillsList = [
    { name: 'DaVinci Resolve', level: 95, icon: SlidersHorizontal, color: 'from-blue-500 to-indigo-600', category: 'Software' },
    { name: 'Adobe Premiere Pro', level: 90, icon: Video, color: 'from-purple-500 to-indigo-600', category: 'Software' },
    { name: 'After Effects', level: 85, icon: Layers, color: 'from-pink-500 to-purple-600', category: 'Software' },
    { name: 'Photoshop & Lightroom', level: 90, icon: Image, color: 'from-blue-400 to-teal-500', category: 'Software' },
    { name: 'CapCut', level: 80, icon: Film, color: 'from-red-400 to-accent-orange', category: 'Software' },
    
    { name: 'Cinematic Color Grading', level: 95, icon: Aperture, color: 'from-accent-orange to-red-500', category: 'Creative' },
    { name: 'High-Retention Reel Editing', level: 90, icon: Sparkles, color: 'from-yellow-500 to-accent-orange', category: 'Creative' },
    { name: 'Cinematography / Camera Work', level: 85, icon: Film, color: 'from-accent-violet to-purple-600', category: 'Creative' },
    { name: 'Visual Effects & Compositing', level: 80, icon: Paintbrush, color: 'from-pink-500 to-accent-violet', category: 'Creative' }
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[#09090c] border-y border-white/5">
      {/* Visual neon lines */}
      <div className="absolute top-0 left-10 w-[1px] h-full bg-gradient-to-b from-accent-orange/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-10 w-[1px] h-full bg-gradient-to-b from-accent-violet/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent-orange tracking-widest uppercase">02 / PROFICIENCIES</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mt-2">
            Arsenal & Skillsets
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-orange to-accent-violet mt-4 mx-auto rounded-full" />
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Software Skills */}
          <div>
            <h3 className="font-display font-bold text-xl tracking-wider text-white border-b border-white/5 pb-3 mb-8 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-orange" />
              Software Mastery
            </h3>
            
            <div className="flex flex-col gap-6">
              {skillsList.filter(s => s.category === 'Software').map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                          <Icon className="w-4.5 h-4.5 text-white/70" />
                        </div>
                        <span className="font-medium text-sm text-white/95">{skill.name}</span>
                      </div>
                      <span className="text-xs font-mono text-white/50">{skill.level}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-dark-card border border-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Creative Proficiencies */}
          <div>
            <h3 className="font-display font-bold text-xl tracking-wider text-white border-b border-white/5 pb-3 mb-8 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-violet" />
              Creative Competence
            </h3>

            <div className="flex flex-col gap-6">
              {skillsList.filter(s => s.category === 'Creative').map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                          <Icon className="w-4.5 h-4.5 text-white/70" />
                        </div>
                        <span className="font-medium text-sm text-white/95">{skill.name}</span>
                      </div>
                      <span className="text-xs font-mono text-white/50">{skill.level}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-dark-card border border-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Technical stack icons or software labels footer */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-500">
          <span className="font-mono text-xs text-white">LUT CREATION</span>
          <span className="text-white/20">&bull;</span>
          <span className="font-mono text-xs text-white">RED RAW WORKFLOWS</span>
          <span className="text-white/20">&bull;</span>
          <span className="font-mono text-xs text-white">SPEED-RAMP OPTIMIZATIONS</span>
          <span className="text-white/20">&bull;</span>
          <span className="font-mono text-xs text-white">MULTI-CAM EDITING</span>
          <span className="text-white/20">&bull;</span>
          <span className="font-mono text-xs text-white">SOUND DIALOGUE DENOISING</span>
        </div>

      </div>
    </section>
  );
}
