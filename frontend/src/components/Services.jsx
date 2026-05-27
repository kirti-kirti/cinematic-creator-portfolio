import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleInquireService = (title) => {
    const target = document.querySelector('#contact');
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

      let mappedType = 'Video Editing';
      const cleanTitle = title.toLowerCase();
      
      if (cleanTitle.includes('wedding')) {
        mappedType = 'Wedding Film';
      } else if (cleanTitle.includes('reel')) {
        mappedType = 'Cinematic Reel';
      } else if (cleanTitle.includes('youtube')) {
        mappedType = 'YouTube Production';
      } else if (cleanTitle.includes('commercial') || cleanTitle.includes('brand')) {
        mappedType = 'Commercial Video';
      } else if (cleanTitle.includes('thumbnail')) {
        mappedType = 'Thumbnail Design';
      } else if (cleanTitle.includes('photography')) {
        mappedType = 'Photography Shoot';
      }

      setTimeout(() => {
        const typeDropdown = document.querySelector('#projectType');
        if (typeDropdown) {
          typeDropdown.value = mappedType;
          const event = new Event('change', { bubbles: true });
          typeDropdown.dispatchEvent(event);
        }
      }, 500);
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-[#09090c] border-y border-white/5">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent-orange tracking-widest uppercase">04 / WHAT I OFFER</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mt-2">
            Creative Services
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-orange to-accent-violet mt-4 mx-auto rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, index) => {
            // Dynanically load Lucide icon from string name
            const IconComponent = Icons[srv.icon] || Icons.HelpCircle;
            
            return (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleInquireService(srv.title)}
                className="group relative rounded-2xl border border-white/5 bg-dark-card p-8 flex flex-col justify-between transition-all duration-300 hover:border-accent-orange/30 hover:bg-[#111116] cursor-pointer"
              >
                {/* Accent neon corner hover glow */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent-orange/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-accent-orange/30 group-hover:bg-accent-orange/5 transition-all duration-300">
                    <IconComponent className="w-5 h-5 text-white/70 group-hover:text-accent-orange transition-colors" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl text-white mt-6 group-hover:text-accent-orange transition-colors">
                    {srv.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 text-sm mt-4 leading-relaxed font-light">
                    {srv.description}
                  </p>
                </div>

                {/* Pricing info */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">PRICING STARTS AT</span>
                    <span className="font-display font-bold text-2xl text-white mt-1 block">
                      ₹{srv.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <span className="text-[10px] font-mono text-accent-orange tracking-widest group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                    INQUIRE &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
