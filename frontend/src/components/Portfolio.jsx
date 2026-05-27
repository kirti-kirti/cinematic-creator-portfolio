import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image, Layers, Eye, X, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';

// Auto-convert any YouTube URL to youtube-nocookie embed
const toYouTubeEmbed = (url) => {
  if (!url) return url;
  if (url.startsWith('/uploads') || /\.(mp4|mov|webm|ogg)($|\?)/i.test(url)) return url;
  let videoId = null;
  const shortMatch = url.match(/youtu\.be\/([^?&/#]+)/);
  if (shortMatch) videoId = shortMatch[1];
  const watchMatch = url.match(/[?&]v=([^&/#]+)/);
  if (watchMatch) videoId = watchMatch[1];
  const shortsMatch = url.match(/\/shorts\/([^?&/#]+)/);
  if (shortsMatch) videoId = shortsMatch[1];
  const embedMatch = url.match(/\/embed\/([^?&/#]+)/);
  if (embedMatch) videoId = embedMatch[1];
  if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}`;
  return url;
};

// Before/After comparison slider component
function BeforeAfterSlider({ before, after }) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/5"
    >
      {/* Before Image (Behind) */}
      <img 
        src={before} 
        alt="Before Grade" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/70 backdrop-blur rounded font-mono text-[10px] text-white/70 uppercase tracking-widest border border-white/5">
        RAW LOG (BEFORE)
      </div>

      {/* After Image (Front, Clipped) */}
      <div 
        className="absolute inset-y-0 right-0 left-0 z-10 overflow-hidden pointer-events-none"
        style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
      >
        <img 
          src={after} 
          alt="After Grade" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%', maxWidth: 'none' }}
        />
      </div>
      <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-accent-orange/80 backdrop-blur rounded font-mono text-[10px] text-white uppercase tracking-widest border border-accent-orange/30">
        GRADED (AFTER)
      </div>

      {/* Divider Bar & Handle */}
      <div 
        className="absolute inset-y-0 z-30 w-0.5 bg-accent-orange"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent-orange flex items-center justify-center text-white slider-handle">
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const dialogRef = useRef(null);

  const categories = ['All', 'Video Editing', 'Photography', 'Reels', 'Cinematic', 'Events'];

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) throw new Error('Failed to load portfolio items');
        const data = await res.ok ? await res.json() : [];
        setItems(data);
      } catch (err) {
        console.error("API error, using local fallback data:", err);
        // Fail-safe fallback already seeded in the database file
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  // Filtered items
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  // Lightbox controllers
  const openLightbox = (item) => {
    setSelectedItem(item);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeLightbox = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setSelectedItem(null);
  };

  // Fallback for click outside standard dialog closedby (Safari compatibility check)
  const handleDialogClick = (e) => {
    if (e.target === dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      const clickInside = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!clickInside) {
        closeLightbox();
      }
    }
  };

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="font-mono text-xs text-accent-orange tracking-widest uppercase">03 / PROJECTS REEL</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mt-2">
              Featured Creations
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-accent-orange to-accent-violet mt-4 rounded-full" />
          </div>

          {/* Categories Navigation Bar */}
          <div className="flex flex-wrap gap-2 mt-8 md:mt-0 max-w-full overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-mono text-[10px] tracking-wider uppercase transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-accent-orange border-accent-orange text-white'
                    : 'bg-dark-card border-white/5 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-dark-card border border-white/5 rounded-2xl overflow-hidden aspect-video cursor-pointer hover:border-white/20 transition-all duration-500"
                onClick={() => openLightbox(item)}
              >
                {/* Thumbnail Image */}
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Grading Indicator tag if beforeAfter is available */}
                {item.beforeAfter && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-accent-orange/20 border border-accent-orange/40 backdrop-blur-md rounded-full text-[9px] font-mono tracking-widest text-accent-orange uppercase">
                    <SlidersHorizontal className="w-3 h-3" />
                    COLOR GRADE COMPARISON
                  </div>
                )}

                {/* Shutter overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300 z-10" />

                {/* Play/View Indicator in center */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-accent-orange/20 border border-accent-orange flex items-center justify-center backdrop-blur shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                    {item.mediaType === 'video' ? (
                      <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                    ) : (
                      <Eye className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                {/* Details Content (Hover Slide In) */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="font-mono text-[9px] text-accent-orange uppercase tracking-wider bg-accent-orange/10 px-2.5 py-0.5 rounded border border-accent-orange/20">
                    {item.category}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-white mt-3 group-hover:text-accent-orange transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Tags list */}
                  <div className="flex flex-wrap gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.tags && item.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-white/40 border border-white/5 bg-white/5 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-dark-card/20">
            <span className="text-white/40 font-mono text-sm uppercase">No projects loaded in this category.</span>
          </div>
        )}
      </div>

      {/* Lightbox dialog modal using closedby="any" and animation guidelines */}
      <dialog 
        ref={dialogRef}
        closedby="any"
        onClick={handleDialogClick}
        onClose={closeLightbox}
        aria-labelledby="dialogTitle"
        className="w-[95%] max-w-5xl rounded-2xl bg-[#09090c] border border-white/10 text-white p-0 overflow-hidden shadow-2xl focus:outline-none"
      >
        {selectedItem && (
          <div className="flex flex-col">
            {/* Header info bar */}
            <div className="px-6 py-4 border-b border-white/5 bg-dark-card/50 flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] text-accent-orange tracking-widest uppercase">{selectedItem.category}</span>
                <h2 id="dialogTitle" className="font-display font-bold text-lg md:text-xl">{selectedItem.title}</h2>
              </div>
              <button 
                onClick={closeLightbox}
                className="w-8 h-8 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media content */}
            <div className="p-6 bg-black flex items-center justify-center border-b border-white/5">
              {/* Conditional Rendering: Before/After Slider VS Video VS Photo */}
              {selectedItem.beforeAfter ? (
                <BeforeAfterSlider 
                  before={selectedItem.beforeAfter.before} 
                  after={selectedItem.beforeAfter.after} 
                />
              ) : selectedItem.mediaType === 'video' ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/5 bg-black">
                  {selectedItem.url && (selectedItem.url.startsWith('/uploads') || /\.(mp4|mov|webm|ogg)($|\?)/i.test(selectedItem.url)) ? (
                    <video
                      src={selectedItem.url}
                      controls
                      autoPlay
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={`${toYouTubeEmbed(selectedItem.url)}?autoplay=1&rel=0`}
                      title={selectedItem.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 w-full h-full"
                    />
                  )}
                </div>
              ) : (
                <div className="max-h-[70vh] rounded-xl overflow-hidden border border-white/5">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="w-full max-h-[65vh] object-contain"
                  />
                </div>
              )}
            </div>

            {/* Details Description */}
            <div className="p-6 bg-[#09090c]">
              <h4 className="font-mono text-xs text-white/40 uppercase tracking-widest">ABOUT PROJECT</h4>
              <p className="text-white/70 mt-2 text-sm leading-relaxed font-light">
                {selectedItem.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/5">
                {selectedItem.tags && selectedItem.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono text-accent-orange border border-accent-orange/20 bg-accent-orange/5 px-3 py-1 rounded-full uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
