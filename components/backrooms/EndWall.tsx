'use client';

import { useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
// Calculate end position based on media positions (last media at index 29)
// Position: CORRIDOR_START - 20 - (29 * 30) = 10 - 20 - 870 = -880
const LAST_MEDIA_Z = -880;
const END_WALL_Z = LAST_MEDIA_Z - 30; // 30 units after last media

interface EndWallProps {
  onReturnToStart?: () => void;
}

export function EndWall({ onReturnToStart }: EndWallProps) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <group position={[0, 2, END_WALL_Z]}>
      {/* Wall - ignores fog */}
      <mesh>
        <planeGeometry args={[12, 4]} />
        <meshBasicMaterial 
          color="#3a3530" 
          fog={false}
        />
      </mesh>

      {/* Bright spotlight */}
      <spotLight
        position={[0, 5, 2]}
        target-position={[0, 2, END_WALL_Z]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={1.2}
        color="#fffff0"
        distance={15}
      />

      {/* Additional point light */}
      <pointLight
        position={[0, 2, 3]}
        intensity={0.5}
        color="#ffffe0"
        distance={8}
      />

      {/* Interactive HTML */}
      <Html
        transform
        occlude
        position={[0, 0, 0.1]}
        style={{ width: '500px', height: '250px' }}
      >
        <div 
          className="w-full h-full relative flex items-center justify-center cursor-pointer"
          onMouseMove={handleMouseMove}
          onClick={() => onReturnToStart?.()}
          style={{ background: '#3a3530' }}
        >
          {/* Light beam following mouse */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle 120px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 255, 240, 0.6) 0%, rgba(255, 255, 240, 0.2) 40%, transparent 70%)`,
            }}
          />

          {/* Shadow under cursor */}
          <div 
            className="absolute pointer-events-none"
            style={{
              left: `${mousePos.x * 100}%`,
              top: `${mousePos.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '30px',
              height: '30px',
              background: 'radial-gradient(circle, rgba(0,0,0,0.9) 0%, transparent 80%)',
              filter: 'blur(3px)',
            }}
          />

          {/* FIN text */}
          <div className="text-center relative z-10">
            <h1 
              className="text-7xl font-bold tracking-[0.4em]"
              style={{ 
                color: '#f0e8d8',
                fontFamily: 'Courier New, monospace',
                textShadow: '0 0 30px rgba(255, 255, 240, 0.8)',
              }}
            >
              FIN
            </h1>
            <p className="text-sm text-amber-200/60 mt-4 font-mono tracking-widest">
              [ click to restart ]
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
}
