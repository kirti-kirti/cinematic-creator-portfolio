import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onComplete, 1000); // Wait for shutter animation to finish
          }, 400);
          return 100;
        }
        // Random incremental steps for natural loading simulation
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Top Shutter */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#09090b] border-b border-white/5 flex items-end justify-center pb-8"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          >
            <div className="text-center">
              <span className="font-display font-bold text-4xl md:text-6xl tracking-widest text-white/90">
                NAVNEET
              </span>
              <div className="text-xs md:text-sm text-accent-orange font-mono tracking-widest mt-2 uppercase">
                Director &bull; Editor &bull; Creator
              </div>
            </div>
          </motion.div>

          {/* Bottom Shutter */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#09090b] border-t border-white/5 flex flex-col items-center justify-start pt-12"
            initial={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          >
            {/* Shutter aperture ring detail in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-white rounded-full flex items-center justify-center">
                <div className="w-[200px] h-[200px] md:w-[350px] md:h-[350px] border border-dashed border-white rounded-full" />
              </div>
            </div>

            {/* Loading text and indicator */}
            <div className="relative z-10 w-64 md:w-80 flex flex-col items-center">
              <div className="flex justify-between w-full text-xs font-mono text-white/50 mb-2">
                <span>CINEMATIC CALIBRATION</span>
                <span>{progress}%</span>
              </div>
              
              {/* Progress bar container */}
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-violet to-accent-orange"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              
              <span className="text-[10px] font-mono text-white/30 mt-3 animate-pulse uppercase tracking-widest">
                Loading Assets... [S-LOG3.LUT Loaded]
              </span>
            </div>
          </motion.div>
          
          {/* Shutter Blade center circle simulation */}
          <motion.div
            className="absolute w-20 h-20 md:w-28 md:h-28 border border-white/10 bg-[#050505] rounded-full flex items-center justify-center z-20 pointer-events-none"
            initial={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
          >
            <div className="w-6 h-6 border-2 border-accent-orange/40 rounded-full animate-ping" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
