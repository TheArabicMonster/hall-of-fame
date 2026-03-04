import { create } from 'zustand';
import { GameState } from '@/types';

export const useGameStore = create<GameState>((set) => ({
  isPlaying: false,
  playerPosition: { x: 0, y: 1.7, z: 0 },
  selectedMedia: null,
  nearbyMedia: null,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setSelectedMedia: (media) => set({ selectedMedia: media }),
  setNearbyMedia: (media) => set({ nearbyMedia: media }),
}));
