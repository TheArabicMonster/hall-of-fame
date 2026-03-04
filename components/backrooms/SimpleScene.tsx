'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Media } from '@/types';

// Simple movement hook
function useMovement() {
  const { camera } = useThree();
  const position = useRef(new THREE.Vector3(0, 1.7, 5));
  const targetZ = useRef(5);
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Move forward/backward based on scroll
      targetZ.current -= e.deltaY * 0.01;
      // Clamp between start and end
      targetZ.current = Math.max(-600, Math.min(10, targetZ.current));
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);
  
  useFrame(() => {
    // Smooth movement
    position.current.z += (targetZ.current - position.current.z) * 0.05;
    camera.position.copy(position.current);
    camera.lookAt(0, 1.7, position.current.z - 10);
  });
  
  return position.current;
}

// Pool corridor component
function PoolCorridorSimple() {
  const { camera } = useThree();
  const playerZ = camera.position.z;
  
  // Generate segments ahead of player
  const segments = [];
  const startSeg = Math.floor(playerZ / 10) - 2;
  for (let i = 0; i < 15; i++) {
    const segZ = (startSeg + i) * 10;
    if (segZ < playerZ + 100) {
      segments.push({ id: startSeg + i, z: segZ });
    }
  }
  
  return (
    <>
      {/* Ceiling */}
      <mesh position={[0, 6, playerZ - 50]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 200]} />
        <meshStandardMaterial color="#E8E6D9" />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-10, 2, playerZ - 50]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[200, 8]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[10, 2, playerZ - 50]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[200, 8]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
      
      {/* Floor tiles */}
      <mesh position={[-8, -1.5, playerZ - 50]}>
        <boxGeometry args={[4, 1, 200]} />
        <meshStandardMaterial color="#E0DED0" />
      </mesh>
      <mesh position={[8, -1.5, playerZ - 50]}>
        <boxGeometry args={[4, 1, 200]} />
        <meshStandardMaterial color="#E0DED0" />
      </mesh>
      
      {/* Tile pattern segments */}
      {segments.map((seg) => (
        <group key={seg.id}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[-8 + i, -0.99, seg.z + 5]}>
              <planeGeometry args={[0.95, 9.9]} />
              <meshStandardMaterial color="#D0CEC0" />
            </mesh>
          ))}
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[5 + i, -0.99, seg.z + 5]}>
              <planeGeometry args={[0.95, 9.9]} />
              <meshStandardMaterial color="#D0CEC0" />
            </mesh>
          ))}
          
          {/* Columns every 3 segments */}
          {seg.id % 3 === 0 && (
            <>
              <mesh position={[-9, 3, seg.z + 5]}>
                <cylinderGeometry args={[0.3, 0.3, 6]} />
                <meshStandardMaterial color="#D0D0D0" />
              </mesh>
              <mesh position={[9, 3, seg.z + 5]}>
                <cylinderGeometry args={[0.3, 0.3, 6]} />
                <meshStandardMaterial color="#D0D0D0" />
              </mesh>
            </>
          )}
        </group>
      ))}
      
      {/* Water */}
      <mesh position={[0, -2, playerZ - 50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 200]} />
        <meshStandardMaterial color="#4A90D9" transparent opacity={0.8} />
      </mesh>
      
      {/* Fog */}
      <fog attach="fog" args={['#1a2e4a', 15, 80]} />
    </>
  );
}

// Simple image display
function SimpleImageDisplay({ media, onClick }: { media: Media; onClick: (m: Media) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = media.position.y + Math.sin(clock.getElapsedTime() + parseInt(media.id)) * 0.05;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={[media.position.x, media.position.y, media.position.z]}
      rotation={[0, media.rotation.y, 0]}
      onClick={() => onClick(media)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[2, 1.5]} />
      <meshBasicMaterial 
        color={hovered ? "#33ff00" : "#0d1b0d"} 
      />
      {/* Floating label */}
      <mesh position={[0, -1, 0.1]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </mesh>
  );
}

// Generate media positions
const ALL_MEDIA: Media[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  url: `https://picsum.photos/400/300?random=${i}`,
  type: i % 3 === 0 ? 'video' : 'image',
  title: `Memory ${String(i + 1).padStart(2, '0')}`,
  votes: Math.floor(Math.random() * 200),
  position: {
    x: i % 2 === 0 ? -3 : 3,
    y: 2,
    z: -15 - (i * 12),
  },
  rotation: {
    x: 0,
    y: i % 2 === 0 ? 0.3 : -0.3,
    z: 0,
  },
}));

// Main scene content
function SceneContent() {
  const playerPos = useMovement();
  const [selected, setSelected] = useState<Media | null>(null);
  
  // Show only nearby media
  const visibleMedia = ALL_MEDIA.filter(m => {
    const dist = Math.abs(m.position.z - playerPos.z);
    return dist < 35;
  });
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.5} />
      <pointLight position={[0, 4, 0]} intensity={0.3} color="#4A90D9" />
      
      {/* Stars */}
      <Stars radius={60} depth={50} count={500} factor={4} saturation={0} fade speed={0.3} />
      
      {/* Environment */}
      <PoolCorridorSimple />
      
      {/* Media displays */}
      {visibleMedia.map((media) => (
        <SimpleImageDisplay 
          key={media.id} 
          media={media} 
          onClick={setSelected}
        />
      ))}
      
      {/* Selected media info */}
      {selected && (
        <mesh position={[playerPos.x, playerPos.y, playerPos.z - 3]}>
          <planeGeometry args={[3, 2]} />
          <meshBasicMaterial color="#0d1b0d" />
        </mesh>
      )}
    </>
  );
}

// Main export
export function SimpleScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.7, 5], fov: 75 }}
      gl={{ antialias: true }}
      style={{ background: '#0d1b2a' }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
