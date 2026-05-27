import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiUrl } from '../api.js';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'Video Editing',
    budget: '₹5,000 - ₹15,000',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const projectTypes = [
    'Video Editing',
    'Photography Shoot',
    'Cinematic Reel',
    'Commercial Video',
    'Wedding Film',
    'YouTube Production',
    'Thumbnail Design'
  ];

  const budgets = [
    'Under ₹2,000',
    '₹2,000 - ₹5,000',
    '₹5,000 - ₹15,000',
    '₹15,000 - ₹50,000',
    '₹50,000+'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(apiUrl('/api/inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to submit form. Please try again.');

      // Clear Form & Trigger Confetti!
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectType: 'Video Editing',
        budget: '₹5,000 - ₹15,000',
        message: ''
      });
      
      setStatus('success');
      
      // Fire confetti bursts!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff5722', '#8a2be2', '#ffffff']
      });

    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    
    // Manually trigger form validation since it is clicked as a custom button
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      if (nameInput && !formData.name) nameInput.focus();
      else if (phoneInput && !formData.phone) phoneInput.focus();
      else if (emailInput && !formData.email) emailInput.focus();
      else if (messageInput && !formData.message) messageInput.focus();
      
      const form = nameInput?.closest('form');
      if (form) {
        form.reportValidity();
      }
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // 1. Submit to database in the background
      const res = await fetch(apiUrl('/api/inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to submit form. Please try again.');

      // 2. Format details and open WhatsApp
      const messageText = `Hi Navneet, my name is *${formData.name}*.\nI saw your portfolio and want to hire you!\n\n` +
                          `🎥 *Project Type:* ${formData.projectType}\n` +
                          `💰 *Budget Range:* ${formData.budget}\n` +
                          `📞 *Phone:* ${formData.phone}\n` +
                          `✉️ *Email:* ${formData.email}\n\n` +
                          `📝 *Project Details:*\n${formData.message}`;

      const whatsappUrl = `https://wa.me/918287341059?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, '_blank');

      // 3. Clear Form & Trigger Confetti!
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectType: 'Video Editing',
        budget: '₹5,000 - ₹15,000',
        message: ''
      });
      
      setStatus('success');
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff5722', '#8a2be2', '#ffffff']
      });

    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#050505]">
      {/* Glow ambient background element */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent-orange tracking-widest uppercase">08 / COLLABORATION</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mt-2">
            Let’s Create Something Cinematic Together
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-orange to-accent-violet mt-4 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
          
          {/* Quick Contact & Details Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <h3 className="font-display font-bold text-2xl text-white">Get in Touch</h3>
              <p className="text-white/60 text-sm mt-3 leading-relaxed font-light">
                Have an idea, project, or event coming up? Fill out the brief form or reach out directly via one of my social channels. I look forward to working together!
              </p>
            </div>

            {/* Direct Details */}
            <div className="flex flex-col gap-4">
              {/* Mail */}
              <a 
                href="mailto:kushwahanavnweet153@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-dark-card/30 hover:border-white/10 hover:bg-dark-card/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-accent-orange/30 group-hover:bg-accent-orange/5 transition-all">
                  <Mail className="w-4.5 h-4.5 text-white/60 group-hover:text-accent-orange transition-colors" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 block uppercase">Email Me</span>
                  <span className="text-sm font-medium text-white/90">kushwahanavnweet153@gmail.com</span>
                </div>
              </a>

              {/* Location */}
              <div 
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-dark-card/30"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                  <MapPin className="w-4.5 h-4.5 text-white/60" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 block uppercase">Based In</span>
                  <span className="text-sm font-medium text-white/90">Delhi, India</span>
                </div>
              </div>
            </div>

            {/* Premium Social Links Panel */}
            <div className="p-6 rounded-2xl border border-white/5 bg-dark-card/20">
              <h4 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Direct Messaging Connect</h4>
              
              <div className="flex flex-col gap-3">
                {/* WhatsApp Chat */}
                <a
                  href="https://wa.me/918287341059?text=Hi%20Navneet%2C%20I%27d%20love%20to%20hire%20you%20for%20a%20project!"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-mono text-xs font-semibold tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white transition-colors duration-300"
                >
                  <MessageSquare className="w-4 h-4" />
                  WHATSAPP CHAT
                </a>

                {/* Instagram Direct */}
                <a
                  href="https://instagram.com/navneet_kushwaha_19"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-mono text-xs font-semibold tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors duration-300"
                >
                  <Instagram className="w-4 h-4" />
                  INSTAGRAM DIRECT
                  <ExternalLink className="w-3 h-3 text-white/45" />
                </a>
              </div>
            </div>
          </div>

          {/* Form Submission Column */}
          <div className="lg:col-span-7">
            <div className="glass p-8 rounded-3xl border border-white/5">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Name & Phone Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="px-4 py-3.5 rounded-xl border border-white/5 bg-black/40 text-white placeholder-white/20 focus:outline-none focus:border-accent-orange text-sm transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="px-4 py-3.5 rounded-xl border border-white/5 bg-black/40 text-white placeholder-white/20 focus:outline-none focus:border-accent-orange text-sm transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Email, Project Type & Budget Group */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="px-4 py-3.5 rounded-xl border border-white/5 bg-black/40 text-white placeholder-white/20 focus:outline-none focus:border-accent-orange text-sm transition-colors duration-300"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="projectType" className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Project Type</label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="px-4 py-3.5 rounded-xl border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange text-sm transition-colors duration-300 cursor-pointer"
                    >
                      {projectTypes.map(type => (
                        <option key={type} value={type} className="bg-[#09090c] text-white">{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="budget" className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Est. Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="px-4 py-3.5 rounded-xl border border-white/5 bg-black/40 text-white focus:outline-none focus:border-accent-orange text-sm transition-colors duration-300 cursor-pointer"
                    >
                      {budgets.map(b => (
                        <option key={b} value={b} className="bg-[#09090c] text-white">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Project Details</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    placeholder="Tell me about your vision, raw footage timeline, output deliverables, etc."
                    value={formData.message}
                    onChange={handleChange}
                    className="px-4 py-3.5 rounded-xl border border-white/5 bg-black/40 text-white placeholder-white/20 focus:outline-none focus:border-accent-orange text-sm transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Submit buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-4 rounded-xl font-mono text-[10px] tracking-widest font-bold bg-[#0c0c10] hover:bg-[#14141c] text-white border border-white/5 hover:border-white/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4 text-white/60" />
                    {loading ? 'SENDING...' : 'SUBMIT PORTFOLIO FORM'}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    disabled={loading}
                    className="py-4 rounded-xl font-mono text-[10px] tracking-widest font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                  >
                    <svg className="w-4 h-4 fill-current animate-bounce" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.216 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {loading ? 'SENDING...' : 'SEND VIA WHATSAPP (INSTANT)'}
                  </button>
                </div>

                {/* Success/Error Alerts */}
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 text-center text-xs font-mono tracking-wide"
                  >
                    🚀 BRIEF TRANSMITTED! I'll contact you in less than 24 hours.
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-rose-600/10 border border-rose-500/30 text-rose-400 text-center text-xs font-mono tracking-wide"
                  >
                    ⚠️ TRANSMISSION ERROR. Please check connection and retry.
                  </motion.div>
                )}

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
