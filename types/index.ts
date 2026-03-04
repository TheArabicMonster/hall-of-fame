export interface Media {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  title: string;
  description?: string;
  votes: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
}

export interface GameState {
  isPlaying: boolean;
  playerPosition: {
    x: number;
    y: number;
    z: number;
  };
  selectedMedia: Media | null;
  nearbyMedia: Media | null;
  setIsPlaying: (playing: boolean) => void;
  setPlayerPosition: (pos: { x: number; y: number; z: number }) => void;
  setSelectedMedia: (media: Media | null) => void;
  setNearbyMedia: (media: Media | null) => void;
}

export interface VoteData {
  mediaId: string;
  userIp?: string;
}
