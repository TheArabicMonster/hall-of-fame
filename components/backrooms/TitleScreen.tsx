'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function TitleScreen() {
  const { setIsPlaying } = useGameStore();
  const [showText, setShowText] = useState(true);
  const [glitch, setGlitch] = useState(false);

  // Blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowText(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Occasional glitch
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsPlaying(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleStart}
      style={{
        background: 'linear-gradient(180deg, #1a1612 0%, #0d0b0a 50%, #1a1612 100%)',
      }}
    >
      {/* Pool water effect overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74, 144, 217, 0.1) 2px, rgba(74, 144, 217, 0.1) 4px)',
          animation: 'scanline 8s linear infinite',
        }}
      />

      {/* CRT vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Main content */}
      <div 
        className={`relative z-10 text-center transition-transform duration-75 ${glitch ? 'translate-x-2' : ''}`}
      >
        {/* Title */}
        <h1 
          className="text-6xl md:text-8xl font-mono mb-4 tracking-widest"
          style={{
            color: '#d4a84b',
            textShadow: glitch 
              ? '2px 0 #ff0000, -2px 0 #00ffff' 
              : '0 0 20px #d4a84b, 0 0 40px #d4a84b, 0 0 60px #d4a84b',
            fontFamily: 'Courier New, monospace',
          }}
        >
          THE POOLROOMS
        </h1>

        <h2 
          className="text-2xl md:text-3xl font-mono mb-12 tracking-[0.5em]"
          style={{
            color: '#E8E6D9',
            opacity: 0.8,
          }}
        >
          HALL OF FAME
        </h2>

        {/* Decorative line */}
        <div 
          className="w-64 h-px mx-auto mb-12"
          style={{
            background: 'linear-gradient(90deg, transparent, #4A90D9, transparent)',
          }}
        />

        {/* Blinking text */}
        <p 
          className="text-xl md:text-2xl font-mono animate-pulse"
          style={{
            color: '#33ff00',
            textShadow: '0 0 10px #33ff00',
            opacity: showText ? 1 : 0.3,
            transition: 'opacity 0.1s',
            fontFamily: 'Courier New, monospace',
          }}
        >
          [ CLICK ANYWHERE TO ENTER ]
        </p>

        {/* Instructions */}
        <div 
          className="mt-8 p-4 border border-dashed max-w-md mx-auto"
          style={{
            borderColor: '#d4a84b',
            background: 'rgba(212, 168, 75, 0.05)',
          }}
        >
          <p 
            className="text-sm font-mono mb-2"
            style={{
              color: '#d4a84b',
              fontFamily: 'Courier New, monospace',
            }}
          >
            ▼ HOW TO NAVIGATE ▼
          </p>
          <p 
            className="text-xs font-mono"
            style={{
              color: '#999',
              lineHeight: 1.8,
            }}
          >
            <span style={{ color: '#33ff00' }}>SCROLL DOWN</span> → Walk forward<br />
            <span style={{ color: '#33ff00' }}>SCROLL UP</span> → Walk backward<br />
            <span style={{ color: '#33ff00' }}>CLICK</span> → View media / Vote<br />
            Audio enabled for immersion
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div 
        className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2"
        style={{ borderColor: '#d4a84b', opacity: 0.5 }}
      />
      <div 
        className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2"
        style={{ borderColor: '#d4a84b', opacity: 0.5 }}
      />
      <div 
        className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2"
        style={{ borderColor: '#d4a84b', opacity: 0.5 }}
      />
      <div 
        className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2"
        style={{ borderColor: '#d4a84b', opacity: 0.5 }}
      />

      {/* Version */}
      <p 
        className="absolute bottom-4 right-4 text-xs font-mono"
        style={{ color: '#d4a84b', opacity: 0.5 }}
      >
        v1.0.0 // BACKROOMS_EDITION
      </p>
    </div>
  );
}
