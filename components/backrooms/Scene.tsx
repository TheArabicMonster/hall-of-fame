'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { PoolCorridor } from './PoolCorridor';
import { FloatingCRT } from './FloatingCRT';
import { TVSet } from './TVSet';
import { FloatingViewer } from './FloatingViewer';
import { ProximityVote } from './ProximityVote';
import { FirstPersonController } from './FirstPersonController';
import { AudioManager } from './AudioManager';
import { useGameStore } from '@/stores/gameStore';
import { Media } from '@/types';

// Generate media positions deterministically so they don't jump
function generateMediaPositions(count: number): Media[] {
  const media: Media[] = [];
  
  for (let i = 0; i < count; i++) {
    const zPosition = -15 - (i * 12); // Every 12 units, starting at -15
    const isLeft = i % 2 === 0;
    
    media.push({
      id: String(i + 1),
      url: i % 3 === 0 
        ? 'https://utfs.io/f/video-placeholder.mp4'
        : `https://picsum.photos/400/300?random=${i}`,
      type: i % 3 === 0 ? 'video' : 'image',
      title: `Memory ${String(i + 1).padStart(2, '0')}`,
      votes: Math.floor(Math.random() * 200),
      position: {
        x: isLeft ? -2.5 - (Math.sin(i * 0.5) * 0.5) : 2.5 + (Math.sin(i * 0.5) * 0.5),
        y: 1.8 + (Math.cos(i * 0.7) * 0.4),
        z: zPosition,
      },
      rotation: {
        x: 0,
        y: isLeft ? 0.4 : -0.4,
        z: 0,
      },
    });
  }
  
  return media;
}

const ALL_MEDIA = generateMediaPositions(50);

function SceneContent() {
  const { playerPosition, selectedMedia, nearbyMedia, setSelectedMedia, setNearbyMedia } = useGameStore();
  const [media, setMedia] = useState<Media[]>(ALL_MEDIA);

  // Only show media that's reasonably close to player (optimization)
  const visibleMedia = useMemo(() => {
    const playerZ = playerPosition.z;
    return media.filter(m => {
      const dist = Math.abs(m.position.z - playerZ);
      return dist < 40; // Only render media within 40 units
    });
  }, [media, playerPosition.z]);

  // Check proximity to media for voting
  useEffect(() => {
    const nearby = media.find(m => {
      const dx = m.position.x - playerPosition.x;
      const dz = m.position.z - playerPosition.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      return dist < 4 && Math.abs(dz) < 6; // Within 4 units horizontal, 6 units depth
    });
    
    setNearbyMedia(nearby || null);
  }, [playerPosition, media, setNearbyMedia]);

  const handleMediaClick = (item: Media) => {
    setSelectedMedia(item);
  };

  const handleCloseViewer = () => {
    setSelectedMedia(null);
  };

  const handleVote = async (mediaId: string) => {
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId }),
      });
      
      if (res.ok) {
        setMedia(prev => prev.map(m => 
          m.id === mediaId ? { ...m, votes: m.votes + 1 } : m
        ));
      }
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  return (
    <>
      <AudioManager />
      <FirstPersonController />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#E8E6D9" />
      <directionalLight 
        position={[0, 10, 0]} 
        intensity={0.5} 
        color="#4A90D9"
      />
      
      {/* Pool lights along corridor */}
      {[0, 1, 2, 3, 4].map(i => (
        <pointLight 
          key={i}
          position={[0, 4, -i * 40]} 
          intensity={0.4} 
          color="#4A90D9"
          distance={50}
          decay={2}
        />
      ))}

      {/* Stars in ceiling */}
      <Stars radius={60} depth={50} count={800} factor={4} saturation={0} fade speed={0.3} />

      {/* Environment */}
      <PoolCorridor />

      {/* Media displays - only visible ones */}
      {visibleMedia.map((item) => (
        item.type === 'image' ? (
          <FloatingCRT 
            key={item.id} 
            media={item} 
            onClick={handleMediaClick}
          />
        ) : (
          <TVSet 
            key={item.id} 
            media={item} 
            onClick={handleMediaClick}
          />
        )
      ))}

      {/* Selected media viewer */}
      {selectedMedia && (
        <FloatingViewer 
          media={selectedMedia} 
          onClose={handleCloseViewer}
        />
      )}

      {/* Proximity vote UI */}
      {nearbyMedia && !selectedMedia && (
        <ProximityVote
          media={nearbyMedia}
          onVote={handleVote}
          onClose={() => setNearbyMedia(null)}
        />
      )}
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ 
        fov: 75, 
        near: 0.1, 
        far: 1000,
        position: [0, 1.7, 5]
      }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: "high-performance"
      }}
      style={{ background: '#0d1b2a' }}
      dpr={[1, 2]} // Responsive pixel ratio
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
