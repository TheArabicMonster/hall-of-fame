'use client';

import { useEffect } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { useGameStore } from '@/stores/gameStore';

export function AudioManager() {
  const { isPlaying } = useGameStore();
  const { playStep } = useAudio();

  // Play footsteps when moving
  useEffect(() => {
    if (!isPlaying) return;

    let lastZ = 0;
    const checkMovement = () => {
      const { playerPosition } = useGameStore.getState();
      const delta = Math.abs(playerPosition.z - lastZ);
      
      if (delta > 0.5) {
        playStep(1 + delta * 0.5);
        lastZ = playerPosition.z;
      }
      
      requestAnimationFrame(checkMovement);
    };

    const id = requestAnimationFrame(checkMovement);
    return () => cancelAnimationFrame(id);
  }, [isPlaying, playStep]);

  return null;
}
