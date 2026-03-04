'use client';

import { useState, useEffect } from 'react';

export function DesktopCheck({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 1024;
      setIsDesktop(!isMobile && !isSmallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isDesktop) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center p-8 text-center"
        style={{ background: '#0d1b2a' }}
      >
        <div>
          <h1 
            className="text-2xl font-mono mb-4"
            style={{ 
              color: '#4A90D9',
              textShadow: '0 0 20px #4A90D9',
            }}
          >
            DESKTOP ONLY EXPERIENCE
          </h1>
          <p 
            className="font-mono"
            style={{ color: '#E8E6D9' }}
          >
            The Poolrooms Hall of Fame requires a desktop computer<br />
            with keyboard and mouse for the optimal experience.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
