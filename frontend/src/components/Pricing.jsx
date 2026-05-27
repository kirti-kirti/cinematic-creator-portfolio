import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Basic',
      price: '1,999',
      description: 'Ideal for basic short-form edits, reels, or shorts.',
      features: [
        '1x Professional Reel Edit',
        'Basic Color Grading & Balancing',
        'Trending audio synchronization',
        '2 Revision rounds',
        '48-hour Delivery timeline'
      ],
      cta: 'SELECT BASIC',
      budgetRange: '₹1,999 - ₹4,999',
      popular: false
    },
    {
      name: 'Professional',
      price: '4,999',
      description: 'Perfect for brands, cafés, and consistent content creators.',
      features: [
        '5x Reels / Short Videos package',
        'Advanced Transitions & Visual FX',
        'Cinematic Sound Design & Mix',
        'Custom Subtitles & Text Overlays',
        '4 Revision rounds',
        'Priority 24-hour Delivery'
      ],
      cta: 'SELECT PROFESSIONAL',
      budgetRange: '₹4,999 - ₹14,999',
      popular: true
    },
    {
      name: 'Cinematic Premium',
      price: '14,999',
      description: 'Full-scale brand promos, weddings, or YouTube production.',
      features: [
        'Full Cinematic Shoot & Filming',
        'Social Media Campaign Package',
        'Viral Thumbnail Design (Photoshop)',
        'DaVinci Resolve Color Science Grading',
        'Advanced Sound FX Modeling',
        'Unlimited Revision rounds'
      ],
      cta: 'SELECT PREMIUM',
      budgetRange: '₹14,999+',
      popular: false
    }
  ];

  const handleSelectPlan = (budgetRange) => {
    // Scroll to contact form
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

      // Find the budget select dropdown and set its value
      setTimeout(() => {
        const budgetDropdown = document.querySelector('#budget');
        if (budgetDropdown) {
          budgetDropdown.value = budgetRange;
          // Trigger change event to update React state in Contact form
          const event = new Event('change', { bubbles: true });
          budgetDropdown.dispatchEvent(event);
        }
      }, 500);
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs text-accent-orange tracking-widest uppercase">07 / RATES & PACKAGES</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mt-2">
            Pricing Options
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-orange to-accent-violet mt-4 mx-auto rounded-full" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative rounded-2xl border flex flex-col justify-between p-8 bg-dark-card transition-all duration-300 ${
                plan.popular 
                  ? 'border-accent-orange shadow-[0_0_30px_rgba(255,87,34,0.15)] scale-100 lg:scale-105 z-10' 
                  : 'border-white/5 hover:border-white/10 hover:bg-[#0c0c10]'
              }`}
            >
              {/* Popular Tag */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent-orange text-[9px] font-mono tracking-widest text-white uppercase flex items-center gap-1.5 shadow-lg">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  MOST POPULAR
                </div>
              )}

              <div>
                {/* Plan Header */}
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest block">{plan.name}</span>
                <div className="flex items-baseline mt-4">
                  <span className="font-display font-bold text-5xl text-white">₹{plan.price}</span>
                  <span className="font-mono text-xs text-white/40 ml-2">/ flat rate</span>
                </div>
                <p className="text-white/60 text-xs mt-4 leading-relaxed font-light">{plan.description}</p>

                {/* Features List */}
                <ul className="flex flex-col gap-3 mt-8 pt-8 border-t border-white/5">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent-orange" />
                      </div>
                      <span className="text-white/70 text-xs font-light leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action */}
              <button
                onClick={() => handleSelectPlan(plan.budgetRange)}
                className={`w-full py-4 rounded-xl font-mono text-[10px] tracking-widest font-bold mt-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'bg-accent-orange border-accent-orange text-white hover:bg-accent-orange/90 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,87,34,0.3)]'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
