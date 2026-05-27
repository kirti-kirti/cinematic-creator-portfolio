import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clipboard, Camera, Edit3, Send } from 'lucide-react';

export default function Timeline() {
  const steps = [
    {
      num: '01',
      title: 'Discussion & Mood',
      icon: MessageSquare,
      desc: 'We align on the vision. We discuss references, build storyboards or mood boards, select the soundtrack style, and map out the goals of the edit or shoot.',
      color: 'border-accent-orange'
    },
    {
      num: '02',
      title: 'Pre-Production Planning',
      icon: Clipboard,
      desc: 'We establish timelines, write scripts, draft shooting scripts, scout locations if needed, choose appropriate cameras/lenses, and schedule the sessions.',
      color: 'border-pink-500'
    },
    {
      num: '03',
      title: 'Cinematic Shooting',
      icon: Camera,
      desc: 'The production phase. Filming with professional cinema gear, steady drone configurations, lighting control, and high-fidelity field sound recording.',
      color: 'border-accent-violet'
    },
    {
      num: '04',
      title: 'Editing & Color Science',
      icon: Edit3,
      desc: 'Post-production. Finding the narrative flow, sound design calibration, SFX mapping, and utilizing DaVinci Resolve to grade log footage to absolute perfection.',
      color: 'border-blue-500'
    },
    {
      num: '05',
      title: 'Master Delivery',
      icon: Send,
      desc: 'Reviewing the draft edits. Fine-tuning according to feedback, outputting in correct codecs (ProRes, H.265), and exporting vertical cut renders optimized for social platforms.',
      color: 'border-teal-500'
    }
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs text-accent-orange tracking-widest uppercase">05 / PIPELINE</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mt-2">
            The Production Process
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-orange to-accent-violet mt-4 mx-auto rounded-full" />
        </div>

        {/* Process Flow */}
        <div className="relative border-l border-white/5 md:border-l-0 md:flex md:justify-between md:gap-4 md:before:absolute md:before:top-10 md:before:left-0 md:before:right-0 md:before:h-[1px] md:before:bg-white/10 max-w-full">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative pl-8 md:pl-0 md:pt-16 mb-12 md:mb-0 md:flex-1 text-left"
              >
                {/* Visual Connector Dot */}
                <div className={`absolute left-0 top-1 -translate-x-1/2 md:-translate-x-0 md:left-1/2 md:-translate-y-1/2 md:top-10 w-6 h-6 rounded-full bg-dark-card border-2 ${step.color} flex items-center justify-center z-10`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Step Card */}
                <div className="glass p-6 rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white/70" />
                      </div>
                      <span className="font-mono text-3xl font-bold opacity-10">{step.num}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-semibold text-lg text-white mt-6">
                      {step.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-white/60 text-xs mt-3 leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
