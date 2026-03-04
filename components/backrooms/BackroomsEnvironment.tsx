'use client';

import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function BackroomsEnvironment() {
  const { camera } = useThree();
  const playerZ = camera.position.z;
  
  // Generate segments
  const segments = useMemo(() => {
    const segs = [];
    const startSeg = Math.floor(playerZ / 15) - 1;
    for (let i = 0; i < 10; i++) {
      const segZ = (startSeg + i) * 15;
      if (segZ < playerZ + 100 && segZ > playerZ - 20) {
        segs.push({ 
          id: startSeg + i, 
          z: segZ,
          hasPillar: (startSeg + i) % 4 === 0,
        });
      }
    }
    return segs;
  }, [Math.floor(playerZ / 15)]);

  // Wall pattern texture - procedurally created
  const wallPattern = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base yellow-beige color
    ctx.fillStyle = '#c9b896';
    ctx.fillRect(0, 0, 512, 512);
    
    // Subtle wallpaper pattern
    ctx.fillStyle = '#b8a684';
    for (let i = 0; i < 512; i += 64) {
      for (let j = 0; j < 512; j += 64) {
        // Draw flower-like pattern
        ctx.beginPath();
        ctx.arc(i + 32, j + 32, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Water stains
    ctx.fillStyle = '#a08060';
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 20 + Math.random() * 40;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 2);
    return texture;
  }, []);

  // Carpet texture
  const carpetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Mustard yellow base
    ctx.fillStyle = '#d4a84b';
    ctx.fillRect(0, 0, 512, 512);
    
    // Noise for carpet texture
    for (let i = 0; i < 50000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const shade = Math.random() > 0.5 ? '#c4983a' : '#e4b85c';
      ctx.fillStyle = shade;
      ctx.fillRect(x, y, 2, 2);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 20);
    return texture;
  }, []);

  // Ceiling tiles texture
  const ceilingTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // White tiles
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 512, 512);
    
    // Grid lines
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 10);
    return texture;
  }, []);

  return (
    <>
      {/* Ambient lighting - very dim, almost dark */}
      <ambientLight intensity={0.08} color="#8a7050" />
      
      {/* Ceiling - follows player - dark on the far edges */}
      <mesh position={[0, 4, playerZ - 50]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 200]} />
        <meshStandardMaterial 
          map={ceilingTexture}
          roughness={1}
          emissive="#1a1a1a"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Left Wall - follows player */}
      <mesh position={[-6, 2, playerZ - 50]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[200, 4]} />
        <meshStandardMaterial 
          map={wallPattern}
          roughness={1}
          emissive="#1a1612"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Right Wall - follows player */}
      <mesh position={[6, 2, playerZ - 50]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[200, 4]} />
        <meshStandardMaterial 
          map={wallPattern}
          roughness={1}
          emissive="#1a1612"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Floor - follows player */}
      <mesh position={[0, 0, playerZ - 50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 200]} />
        <meshStandardMaterial 
          map={carpetTexture}
          roughness={1}
          emissive="#0a0806"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Pillars every 4 segments */}
      {segments.filter(s => s.hasPillar).map((seg) => (
        <group key={seg.id}>
          {/* Left pillar */}
          <mesh position={[-5.5, 2, seg.z + 7.5]}>
            <boxGeometry args={[0.8, 4, 0.8]} />
            <meshStandardMaterial color="#b8a684" roughness={0.9} />
          </mesh>
          {/* Right pillar */}
          <mesh position={[5.5, 2, seg.z + 7.5]}>
            <boxGeometry args={[0.8, 4, 0.8]} />
            <meshStandardMaterial color="#b8a684" roughness={0.9} />
          </mesh>
        </group>
      ))}
      
      {/* Baseboards */}
      <mesh position={[-5.8, 0.1, playerZ - 50]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[200, 0.2]} />
        <meshStandardMaterial color="#8a7050" />
      </mesh>
      <mesh position={[5.8, 0.1, playerZ - 50]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[200, 0.2]} />
        <meshStandardMaterial color="#8a7050" />
      </mesh>
      
      {/* Black panels that block the end of the corridor - covers wall edges */}
      {/* Back wall - far ahead */}
      <mesh position={[0, 2, playerZ - 35]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Left side blocker - covers the left wall end */}
      <mesh position={[-7, 2, playerZ - 35]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Right side blocker - covers the right wall end */}
      <mesh position={[7, 2, playerZ - 35]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Ceiling blocker */}
      <mesh position={[0, 5.5, playerZ - 35]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Floor blocker */}
      <mesh position={[0, 0.1, playerZ - 35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Large black cube behind player to ensure complete darkness ahead */}
      <mesh position={[0, 2, playerZ - 50]}>
        <boxGeometry args={[50, 20, 40]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Dense dark fog - starts very close for ominous feel */}
      <fog attach="fog" args={['#050403', 3, 22]} />
    </>
  );
}
