'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Media } from '@/types';
import { useGameStore } from '@/stores/gameStore';
import { lerp } from '@/lib/utils';

interface FloatingViewerProps {
  media: Media;
  onClose: () => void;
}

export function FloatingViewer({ media, onClose }: FloatingViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { playerPosition } = useGameStore();
  
  // Target position in front of player
  const targetPos = useMemo(() => ({
    x: playerPosition.x,
    y: playerPosition.y,
    z: playerPosition.z - 3.5,
  }), [playerPosition.x, playerPosition.y, playerPosition.z]);
  
  // Current position for smooth interpolation
  const currentPos = useRef({ ...targetPos });

  // Smooth follow animation
  useFrame(() => {
    if (groupRef.current) {
      // Lerp towards target position
      currentPos.current.x = lerp(currentPos.current.x, targetPos.x, 0.1);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.y, 0.1);
      currentPos.current.z = lerp(currentPos.current.z, targetPos.z, 0.1);
      
      groupRef.current.position.set(
        currentPos.current.x,
        currentPos.current.y,
        currentPos.current.z
      );
      
      // Always face player
      groupRef.current.lookAt(playerPosition.x, playerPosition.y, playerPosition.z);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dark background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[6, 5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
      </mesh>

      {/* Content */}
      <Html
        transform
        occlude
        position={[0, 0, 0]}
        style={{
          width: '500px',
          height: '400px',
          pointerEvents: 'auto',
        }}
      >
        <div 
          className="relative w-full h-full p-6"
          style={{
            background: 'linear-gradient(135deg, #0d1b0d 0%, #1a2e1a 100%)',
            border: '2px solid #33ff00',
            borderRadius: '4px',
            boxShadow: '0 0 40px rgba(51, 255, 0, 0.3), inset 0 0 40px rgba(51, 255, 0, 0.1)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center font-mono text-lg hover:scale-110 transition-transform"
            style={{
              color: '#33ff00',
              border: '1px solid #33ff00',
              background: 'rgba(51, 255, 0, 0.1)',
              textShadow: '0 0 10px #33ff00',
            }}
          >
            ✕
          </button>

          {/* Scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 1px, transparent 1px, transparent 2px)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <h2 
              className="text-2xl font-mono mb-4 text-center"
              style={{
                color: '#33ff00',
                textShadow: '0 0 10px #33ff00',
              }}
            >
              &gt; {media.title}
            </h2>

            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {media.type === 'image' ? (
                <img 
                  src={media.url}
                  alt={media.title}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    filter: 'contrast(1.1) brightness(0.95)',
                    boxShadow: '0 0 20px rgba(51, 255, 0, 0.2)',
                  }}
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  autoPlay
                  loop
                  className="max-w-full max-h-full"
                  style={{
                    filter: 'contrast(1.1)',
                  }}
                />
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span 
                className="font-mono text-sm"
                style={{ color: '#33ff00', opacity: 0.7 }}
              >
                ID: {media.id} | TYPE: {media.type.toUpperCase()}
              </span>
              <span 
                className="font-mono text-lg"
                style={{ 
                  color: '#33ff00',
                  textShadow: '0 0 10px #33ff00',
                }}
              >
                ♥ {media.votes} VOTES
              </span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
