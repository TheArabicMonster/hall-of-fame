'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

const SEGMENT_LENGTH = 10;
const VISIBLE_SEGMENTS = 12; // How many segments ahead and behind
const WATER_LEVEL = -2;

export function PoolCorridor() {
  const waterRef = useRef<THREE.Mesh>(null);
  const { playerPosition } = useGameStore();

  // Calculate which segments should be visible based on player position
  const segments = useMemo(() => {
    const playerZ = playerPosition.z;
    const playerSegment = Math.floor(playerZ / SEGMENT_LENGTH);
    
    const segs = [];
    // Generate segments ahead and behind player
    for (let i = -2; i < VISIBLE_SEGMENTS; i++) {
      const segmentIndex = playerSegment + i;
      const z = segmentIndex * SEGMENT_LENGTH;
      
      // Only generate if within reasonable distance
      if (z > playerZ - 30 && z < playerZ + 120) {
        segs.push({
          id: segmentIndex,
          z,
          hasColumn: segmentIndex % 3 === 0,
          hasLadder: segmentIndex % 5 === 0,
        });
      }
    }
    return segs;
  }, [playerPosition.z]);

  // Water animation
  useFrame(({ clock }) => {
    if (waterRef.current) {
      const material = waterRef.current.material as THREE.ShaderMaterial;
      if (material?.uniforms) {
        material.uniforms.time.value = clock.getElapsedTime();
      }
    }
  });

  // Water shader
  const waterShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#4A90D9') },
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Gentle wave motion
        float elevation = sin(pos.x * 1.5 + time * 0.5) * 0.05 + 
                         sin(pos.z * 0.8 + time * 0.3) * 0.08 +
                         sin(pos.x * 3.0 + pos.z * 2.0 + time) * 0.02;
        pos.y += elevation;
        vElevation = elevation;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vElevation;
      varying vec2 vUv;
      
      void main() {
        float mixStrength = (vElevation + 0.15) * 3.0;
        vec3 deepColor = vec3(0.17, 0.35, 0.55); // Darker blue
        vec3 surfaceColor = vec3(0.6, 0.8, 1.0); // Light reflection
        
        vec3 finalColor = mix(deepColor, surfaceColor, mixStrength * 0.4);
        float alpha = 0.85 + vElevation * 0.5;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
  }), []);

  return (
    <group>
      {/* Ceiling - follows player */}
      <mesh 
        position={[0, 6, playerPosition.z - 50]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[20, 200]} />
        <meshStandardMaterial color="#E8E6D9" roughness={0.9} />
      </mesh>

      {/* Left Wall - follows player */}
      <mesh 
        position={[-10, 2, playerPosition.z - 50]} 
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[200, 8]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.95} />
      </mesh>

      {/* Right Wall - follows player */}
      <mesh 
        position={[10, 2, playerPosition.z - 50]} 
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[200, 8]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.95} />
      </mesh>

      {/* Floor tiles border - Left side */}
      <mesh 
        position={[-8, WATER_LEVEL + 0.5, playerPosition.z - 50]}
      >
        <boxGeometry args={[4, 1, 200]} />
        <meshStandardMaterial color="#E0DED0" roughness={0.6} />
      </mesh>

      {/* Floor tiles border - Right side */}
      <mesh 
        position={[8, WATER_LEVEL + 0.5, playerPosition.z - 50]}
      >
        <boxGeometry args={[4, 1, 200]} />
        <meshStandardMaterial color="#E0DED0" roughness={0.6} />
      </mesh>

      {/* Tile pattern - generated segments */}
      {segments.map((seg) => (
        <group key={seg.id}>
          {/* Left tile grid */}
          {[0, 1, 2, 3].map((i) => (
            <mesh 
              key={`left-${i}`}
              position={[-8 + i * 1, WATER_LEVEL + 1.01, seg.z + SEGMENT_LENGTH / 2]}
            >
              <planeGeometry args={[0.95, SEGMENT_LENGTH - 0.1]} />
              <meshStandardMaterial color="#D0CEC0" roughness={0.5} />
            </mesh>
          ))}
          
          {/* Right tile grid */}
          {[0, 1, 2, 3].map((i) => (
            <mesh 
              key={`right-${i}`}
              position={[5 + i * 1, WATER_LEVEL + 1.01, seg.z + SEGMENT_LENGTH / 2]}
            >
              <planeGeometry args={[0.95, SEGMENT_LENGTH - 0.1]} />
              <meshStandardMaterial color="#D0CEC0" roughness={0.5} />
            </mesh>
          ))}

          {/* Columns */}
          {seg.hasColumn && (
            <group>
              <mesh position={[-9, 3, seg.z + SEGMENT_LENGTH / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 6]} />
                <meshStandardMaterial color="#D0D0D0" roughness={0.4} />
              </mesh>
              <mesh position={[9, 3, seg.z + SEGMENT_LENGTH / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 6]} />
                <meshStandardMaterial color="#D0D0D0" roughness={0.4} />
              </mesh>
            </group>
          )}

          {/* Pool ladders */}
          {seg.hasLadder && (
            <group position={[0, 0, seg.z + SEGMENT_LENGTH / 2]}>
              {/* Left rail */}
              <mesh position={[-6, WATER_LEVEL + 1.5, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 3]} />
                <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Right rail */}
              <mesh position={[-5.5, WATER_LEVEL + 1.5, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 3]} />
                <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Rungs */}
              {[0, 0.8, 1.6].map((y, i) => (
                <mesh key={i} position={[-5.75, WATER_LEVEL + 0.3 + y, 0]}>
                  <boxGeometry args={[0.6, 0.05, 0.05]} />
                  <meshStandardMaterial color="#808080" metalness={0.8} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}

      {/* Water surface - continuous plane following player */}
      <mesh 
        ref={waterRef}
        position={[0, WATER_LEVEL, playerPosition.z - 50]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[16, 200, 64, 64]} />
        <shaderMaterial {...waterShader} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#1a2e4a', 20, 90]} />
    </group>
  );
}
