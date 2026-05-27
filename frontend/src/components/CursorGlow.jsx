import React, { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [theme, setTheme] = useState('orange'); // Can switch dynamically

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
      
      // Update custom CSS properties on document root
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      
      // Detect if cursor is hovering over clickable elements for hover effects
      const target = e.target;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.classList.contains('clickable')
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Background glow layer */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-300 glow-effect`}
        style={{
          opacity: 0.8
        }}
      />
      
      {/* Custom Pointer glow dot */}
      <div
        className="fixed pointer-events-none z-50 rounded-full transition-transform duration-150 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          width: isHoveringClickable ? '48px' : '20px',
          height: isHoveringClickable ? '48px' : '20px',
          backgroundColor: isHoveringClickable ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 87, 34, 0.6)',
          border: isHoveringClickable ? '1.5px solid rgba(255, 87, 34, 0.8)' : 'none',
          boxShadow: isHoveringClickable 
            ? '0 0 20px rgba(255, 87, 34, 0.4)' 
            : '0 0 10px rgba(255, 87, 34, 0.8)',
          mixBlendMode: 'screen'
        }}
      />
    </>
  );
}
