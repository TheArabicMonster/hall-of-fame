'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Media } from '@/types';
import { useGameStore } from '@/stores/gameStore';
import { useAudio } from '@/hooks/useAudio';

interface TVSetProps {
  media: Media;
  onClick: (media: Media) => void;
}

export function TVSet({ media, onClick }: TVSetProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { playerPosition } = useGameStore();
  const { playClick } = useAudio();
  
  // Memoize check to avoid recalculating every render
  const distance = useMemo(() => {
    return Math.abs(playerPosition.z - media.position.z);
  }, [playerPosition.z, media.position.z]);

  // Check visibility based on distance
  useEffect(() => {
    const shouldBeVisible = distance < 25;
    setIsVisible(shouldBeVisible);
  }, [distance]);

  // Auto-play/pause video
  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {
          setHasError(true);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  const handleClick = () => {
    playClick();
    onClick(media);
  };

  return (
    <group 
      position={[media.position.x, media.position.y, media.position.z]}
      rotation={[media.rotation.x, media.rotation.y, media.rotation.z]}
    >
      {/* TV Stand */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[1.5, 0.8, 1]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.7} />
      </mesh>
      
      {/* TV Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 2, 0.8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0, 0.41]}>
        <boxGeometry args={[2.4, 1.6, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Antenna */}
      <mesh position={[-0.5, 1.2, -0.3]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 1]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>
      <mesh position={[0.5, 1.2, -0.3]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 1]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>

      {/* Screen with video */}
      <Html
        transform
        occlude
        position={[0, 0, 0.45]}
        style={{
          width: '220px',
          height: '165px',
          pointerEvents: 'auto',
        }}
      >
        <div 
          className="relative w-full h-full overflow-hidden cursor-pointer"
          onClick={handleClick}
          style={{
            background: '#000',
            borderRadius: '20px',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
          }}
        >
          {/* Scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)',
            }}
          />
          
          {/* CRT curve overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4)',
              borderRadius: '15px',
            }}
          />

          {/* Static noise when not visible or error */}
          {(!isVisible || hasError) && (
            <div 
              className="absolute inset-0 z-5"
              style={{
                background: `
                  repeating-radial-gradient(circle at 50% 50%, #333 0%, #333 1px, #111 1px, #111 2px),
                  repeating-linear-gradient(45deg, #222 0%, #222 1px, #444 1px, #444 2px)
                `,
                opacity: 0.5,
              }}
            />
          )}

          {/* Video */}
          <video
            ref={videoRef}
            src={media.url}
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              filter: 'contrast(1.2) saturate(0.8) brightness(0.9)',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />

          {/* Channel indicator */}
          <div 
            className="absolute top-2 right-2 px-2 py-1 text-xs font-mono z-30"
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: '#33ff00',
              textShadow: '0 0 5px #33ff00',
            }}
          >
            CH {media.id.padStart(2, '0')}
          </div>
        </div>
      </Html>

      {/* Power light */}
      <mesh position={[1.2, -0.8, 0.41]}>
        <circleGeometry args={[0.05]} />
        <meshBasicMaterial color={isVisible ? "#ff0000" : "#330000"} />
      </mesh>
    </group>
  );
}
