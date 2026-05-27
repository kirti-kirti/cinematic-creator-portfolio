import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { apiUrl } from '../api.js';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch(apiUrl('/api/testimonials'));
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[#09090c] border-y border-white/5">
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent-orange tracking-widest uppercase">06 / CLIENT REVIEWS</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mt-2">
            What Clients Say
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-orange to-accent-violet mt-4 mx-auto rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-8 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all duration-300 relative group"
            >
              {/* Quote bubble absolute accent */}
              <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>

              <div>
                {/* Rating stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-white/80 text-sm italic leading-relaxed mt-6 font-light">
                  "{t.comment}"
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-white">
                    {t.name}
                  </h4>
                  <p className="text-[10px] font-mono text-white/50 tracking-wider mt-0.5 uppercase">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
