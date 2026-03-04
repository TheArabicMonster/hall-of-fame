'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

// Corridor length based on media count (50 media * 15 spacing)
export const CORRIDOR_LENGTH = 800;
export const CORRIDOR_START = 10;
export const CORRIDOR_END = -CORRIDOR_LENGTH;

export function StaticBackrooms() {
  // Wall pattern texture
  const wallPattern = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#c9b896';
    ctx.fillRect(0, 0, 512, 512);
    
    ctx.fillStyle = '#b8a684';
    for (let i = 0; i < 512; i += 64) {
      for (let j = 0; j < 512; j += 64) {
        ctx.beginPath();
        ctx.arc(i + 32, j + 32, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
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
    texture.repeat.set(4, CORRIDOR_LENGTH / 20);
    return texture;
  }, []);

  const carpetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#d4a84b';
    ctx.fillRect(0, 0, 512, 512);
    
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
    texture.repeat.set(4, CORRIDOR_LENGTH / 10);
    return texture;
  }, []);

  const ceilingTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 512, 512);
    
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
    texture.repeat.set(2, CORRIDOR_LENGTH / 20);
    return texture;
  }, []);

  return (
    <>
      {/* Ceiling - FIXED position */}
      <mesh position={[0, 4, -CORRIDOR_LENGTH / 2 + CORRIDOR_START]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, CORRIDOR_LENGTH]} />
        <meshStandardMaterial map={ceilingTexture} roughness={1} emissive="#2a2420" emissiveIntensity={0.15} />
      </mesh>
      
      {/* Left Wall - FIXED */}
      <mesh position={[-6, 2, -CORRIDOR_LENGTH / 2 + CORRIDOR_START]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[CORRIDOR_LENGTH, 4]} />
        <meshStandardMaterial map={wallPattern} roughness={1} emissive="#2a2018" emissiveIntensity={0.12} />
      </mesh>
      
      {/* Right Wall - FIXED */}
      <mesh position={[6, 2, -CORRIDOR_LENGTH / 2 + CORRIDOR_START]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[CORRIDOR_LENGTH, 4]} />
        <meshStandardMaterial map={wallPattern} roughness={1} emissive="#2a2018" emissiveIntensity={0.12} />
      </mesh>
      
      {/* Floor - FIXED */}
      <mesh position={[0, 0, -CORRIDOR_LENGTH / 2 + CORRIDOR_START]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, CORRIDOR_LENGTH]} />
        <meshStandardMaterial map={carpetTexture} roughness={1} emissive="#1a1610" emissiveIntensity={0.08} />
      </mesh>
      
      {/* Baseboards */}
      <mesh position={[-5.8, 0.1, -CORRIDOR_LENGTH / 2 + CORRIDOR_START]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[CORRIDOR_LENGTH, 0.2]} />
        <meshStandardMaterial color="#8a7050" />
      </mesh>
      <mesh position={[5.8, 0.1, -CORRIDOR_LENGTH / 2 + CORRIDOR_START]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[CORRIDOR_LENGTH, 0.2]} />
        <meshStandardMaterial color="#8a7050" />
      </mesh>
      
      {/* Entry wall (behind start) */}
      <mesh position={[0, 2, CORRIDOR_START + 0.1]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color="#1a1612" />
      </mesh>
      

      
      {/* Fog - allows seeing corridor walls but obscures distant media */}
      <fog attach="fog" args={['#1a1612', 3, 35]} />
    </>
  );
}
