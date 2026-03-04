'use client';

import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGameStore } from '@/stores/gameStore';
import { useScrollMovement } from '@/hooks/useScrollMovement';
import { lerp } from '@/lib/utils';

export function FirstPersonController() {
  const { camera } = useThree();
  const { playerPosition, isPlaying } = useGameStore();
  const currentPos = useRef({ x: 0, y: 1.7, z: 5 });
  const time = useRef(0);
  
  // Initialize scroll movement
  useScrollMovement();

  // Smooth camera update with head bob
  useEffect(() => {
    if (!isPlaying) return;

    let animationId: number;
    
    const updateCamera = () => {
      time.current += 0.016;
      
      // Smoothly interpolate current position to target
      currentPos.current.x = lerp(currentPos.current.x, playerPosition.x, 0.1);
      currentPos.current.y = lerp(currentPos.current.y, playerPosition.y, 0.1);
      currentPos.current.z = lerp(currentPos.current.z, playerPosition.z, 0.1);
      
      // Calculate movement speed for head bob
      const moveSpeed = Math.abs(playerPosition.z - currentPos.current.z);
      const isMoving = moveSpeed > 0.001;
      
      // Head bob effect when moving
      let headBobY = 0;
      let headBobRotZ = 0;
      
      if (isMoving) {
        const bobFreq = 10;
        const bobAmp = 0.03;
        headBobY = Math.sin(time.current * bobFreq) * bobAmp;
        headBobRotZ = Math.cos(time.current * bobFreq * 0.5) * 0.005;
      }
      
      // Apply position with head bob
      camera.position.set(
        currentPos.current.x,
        currentPos.current.y + headBobY,
        currentPos.current.z
      );
      
      // Slight camera rotation based on movement
      camera.rotation.z = headBobRotZ;
      
      // Always face forward (negative Z)
      camera.rotation.x = 0;
      camera.rotation.y = Math.PI;
      
      animationId = requestAnimationFrame(updateCamera);
    };

    animationId = requestAnimationFrame(updateCamera);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [camera, isPlaying, playerPosition]);

  // Set initial camera
  useEffect(() => {
    camera.position.set(0, 1.7, 5);
    camera.rotation.set(0, Math.PI, 0);
    currentPos.current = { x: 0, y: 1.7, z: 5 };
  }, [camera]);

  return null;
}
