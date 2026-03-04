'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CORRIDOR_LENGTH, CORRIDOR_START } from './StaticBackrooms';

// Single light component - NO individual useFrame
function StaticLight({ position, intensity }: { position: [number, number, number]; intensity: number }) {
  return (
    <group position={position}>
      {/* Fixture */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2, 0.15, 0.4]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.3} />
      </mesh>
      {/* Glowing part */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.8, 0.05, 0.3]} />
        <meshBasicMaterial color="#ffffe0" opacity={intensity} transparent />
      </mesh>
      {/* Light - NO castShadow */}
      <pointLight
        position={[0, -0.5, 0]}
        color="#ffffe0"
        distance={50}
        decay={1.5}
        intensity={intensity * 0.8}
      />
    </group>
  );
}

// All lights with SINGLE useFrame for flickering
export function FixedLights() {
  const lightsRef = useRef<THREE.Group>(null);
  
  // Only 8 lights instead of 30
  const lightPositions = useMemo(() => {
    const positions = [];
    const spacing = CORRIDOR_LENGTH / 8;
    for (let i = 0; i < 8; i++) {
      positions.push({
        id: i,
        position: [0, 3.8, CORRIDOR_START - 30 - (i * spacing)] as [number, number, number],
      });
    }
    return positions;
  }, []);

  // Single useFrame for ALL lights flickering
  useFrame(({ clock }) => {
    if (!lightsRef.current) return;
    
    const time = clock.getElapsedTime();
    const children = lightsRef.current.children;
    
    children.forEach((child, index) => {
      const offset = index * 1.5;
      const flickerSpeed = 6 + (index % 3);
      
      // Occasional flicker
      const flicker = Math.sin((time + offset) * flickerSpeed) > 0.92 ? 0.3 : 1;
      const hum = Math.sin(time * 50 + offset) * 0.05 + 1;
      const finalIntensity = flicker * hum;
      
      // Update light intensity
      const light = child.children[2] as THREE.PointLight;
      if (light) {
        light.intensity = finalIntensity * 0.4;
      }
      
      // Update glow mesh opacity
      const glow = child.children[1] as THREE.Mesh;
      if (glow && glow.material) {
        (glow.material as THREE.MeshBasicMaterial).opacity = finalIntensity;
      }
    });
  });

  return (
    <group ref={lightsRef}>
      {lightPositions.map((light, i) => (
        <StaticLight key={light.id} position={light.position} intensity={1} />
      ))}
    </group>
  );
}


