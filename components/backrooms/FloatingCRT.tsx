'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Media } from '@/types';
import { useAudio } from '@/hooks/useAudio';

interface FloatingCRTProps {
  media: Media;
  onClick: (media: Media) => void;
}

export function FloatingCRT({ media, onClick }: FloatingCRTProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { playClick } = useAudio();
  
  // Store initial Y to avoid jumping
  const initialY = useMemo(() => media.position.y, [media.position.y]);
  const idOffset = useMemo(() => parseInt(media.id) * 0.5, [media.id]);

  // Floating animation - only modify Y relative to initial
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const floatY = Math.sin(clock.getElapsedTime() * 0.5 + idOffset) * 0.08;
      groupRef.current.position.y = initialY + floatY;
      
      // Subtle rotation
      const rotY = media.rotation.y + Math.sin(clock.getElapsedTime() * 0.3 + idOffset) * 0.02;
      groupRef.current.rotation.y = rotY;
    }
  });

  const handleClick = () => {
    playClick();
    onClick(media);
  };

  return (
    <group 
      ref={groupRef}
      position={[media.position.x, initialY, media.position.z]}
      rotation={[media.rotation.x, media.rotation.y, media.rotation.z]}
    >
      {/* CRT Frame */}
      <mesh>
        <boxGeometry args={[2.4, 1.8, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.5} />
      </mesh>
      
      {/* Screen bezel */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[2.2, 1.6, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Screen with image */}
      <Html
        transform
        occlude
        position={[0, 0, 0.2]}
        style={{
          width: '200px',
          height: '150px',
          pointerEvents: 'auto',
        }}
      >
        <div 
          className="relative w-full h-full cursor-pointer overflow-hidden"
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: '#0d1b0d',
            borderRadius: '8px',
            boxShadow: hovered 
              ? '0 0 30px rgba(0, 255, 65, 0.6), inset 0 0 20px rgba(0, 255, 65, 0.2)' 
              : '0 0 15px rgba(0, 255, 65, 0.3), inset 0 0 10px rgba(0, 255, 65, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Scanlines overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
              backgroundSize: '100% 4px',
            }}
          />
          
          {/* CRT curvature effect */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(0,0,0,0.3)',
              borderRadius: '20px',
            }}
          />

          {/* Image */}
          <img 
            src={media.url} 
            alt={media.title}
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
            style={{
              filter: 'contrast(1.1) brightness(0.9)',
            }}
          />

          {/* Title on screen */}
          <div className="absolute bottom-2 left-2 right-2 text-center z-30">
            <span 
              className="text-xs font-mono"
              style={{
                color: '#33ff00',
                textShadow: '0 0 5px #33ff00',
              }}
            >
              {media.title}
            </span>
          </div>
        </div>
      </Html>

      {/* Glow effect */}
      {hovered && (
        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[3, 2.2]} />
          <meshBasicMaterial 
            color="#00ff41" 
            transparent 
            opacity={0.1} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Cables hanging down */}
      <mesh position={[-0.8, -1, -0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.8, -1, -0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}
