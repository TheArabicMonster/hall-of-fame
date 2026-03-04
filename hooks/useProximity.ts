'use client';

import { useEffect, useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Media } from '@/types';

const PROXIMITY_THRESHOLD = 5;

export function useProximity(media: Media[]) {
  const { playerPosition, setNearbyMedia } = useGameStore();

  // Memoize media positions
  const mediaPositions = useMemo(() => {
    return media.map(m => ({
      ...m,
      distance: Math.sqrt(
        Math.pow(m.position.x - playerPosition.x, 2) +
        Math.pow(m.position.z - playerPosition.z, 2)
      ),
    }));
  }, [media, playerPosition.x, playerPosition.z]);

  useEffect(() => {
    const nearby = mediaPositions.find(m => m.distance < PROXIMITY_THRESHOLD);
    setNearbyMedia(nearby || null);
  }, [mediaPositions, setNearbyMedia]);

  return mediaPositions;
}
