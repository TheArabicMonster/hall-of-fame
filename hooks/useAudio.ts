'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { useGameStore } from '@/stores/gameStore';

export function useAudio() {
  const ambientRef = useRef<Howl | null>(null);
  const stepSounds = useRef<Howl[]>([]);
  const clickSound = useRef<Howl | null>(null);
  const { isPlaying } = useGameStore();
  const lastStepTime = useRef(0);

  useEffect(() => {
    // Initialize sounds
    ambientRef.current = new Howl({
      src: ['/sounds/ambient-pool.mp3'],
      loop: true,
      volume: 0.3,
      html5: true,
    });

    // Multiple step sounds for variety
    stepSounds.current = [
      new Howl({ src: ['/sounds/step-tile-1.mp3'], volume: 0.4 }),
      new Howl({ src: ['/sounds/step-tile-2.mp3'], volume: 0.4 }),
      new Howl({ src: ['/sounds/step-tile-3.mp3'], volume: 0.4 }),
    ];

    clickSound.current = new Howl({
      src: ['/sounds/minecraft-click.ogg'],
      volume: 0.5,
    });

    return () => {
      ambientRef.current?.unload();
      stepSounds.current.forEach(s => s.unload());
      clickSound.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && ambientRef.current) {
      ambientRef.current.play();
    } else {
      ambientRef.current?.pause();
    }
  }, [isPlaying]);

  const playStep = useCallback((speed: number = 1) => {
    if (!isPlaying) return;
    
    const now = Date.now();
    const stepInterval = 600 / speed;
    
    if (now - lastStepTime.current > stepInterval) {
      const randomStep = stepSounds.current[Math.floor(Math.random() * 3)];
      randomStep?.play();
      lastStepTime.current = now;
    }
  }, [isPlaying]);

  const playClick = useCallback(() => {
    clickSound.current?.play();
  }, []);

  return { playStep, playClick };
}
