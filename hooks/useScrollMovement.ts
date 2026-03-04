'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { clamp } from '@/lib/utils';

const SCROLL_SPEED = 0.08;
const MAX_Z = 5;
const MIN_Z = -500; // Allow going deep into the corridor

export function useScrollMovement() {
  const { playerPosition, setPlayerPosition, isPlaying } = useGameStore();
  const targetZRef = useRef(playerPosition.z);
  const currentZRef = useRef(playerPosition.z);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const updatePosition = useCallback(() => {
    if (!isPlaying) return;

    // Smooth lerp towards target
    const diff = targetZRef.current - currentZRef.current;
    
    if (Math.abs(diff) > 0.001) {
      currentZRef.current += diff * 0.08;
      setPlayerPosition({
        x: 0,
        y: 1.7,
        z: currentZRef.current,
      });
    }

    requestAnimationFrame(updatePosition);
  }, [isPlaying, setPlayerPosition]);

  useEffect(() => {
    if (!isPlaying) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Update target based on scroll
      const delta = e.deltaY * SCROLL_SPEED * 0.01;
      targetZRef.current = clamp(
        targetZRef.current - delta,
        MIN_Z,
        MAX_Z
      );

      isScrollingRef.current = true;
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Reset scrolling flag after stop
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    // Initialize refs with current position
    targetZRef.current = playerPosition.z;
    currentZRef.current = playerPosition.z;

    window.addEventListener('wheel', handleWheel, { passive: false });
    const animationId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationId);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isPlaying, playerPosition.z, updatePosition]);

  return {
    isScrolling: isScrollingRef.current,
    targetZ: targetZRef.current,
  };
}
