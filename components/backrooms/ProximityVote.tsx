'use client';

import { useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { Media } from '@/types';
import { Heart, X } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { lerp } from '@/lib/utils';

interface ProximityVoteProps {
  media: Media;
  onVote: (mediaId: string) => void;
  onClose: () => void;
}

export function ProximityVote({ media, onVote, onClose }: ProximityVoteProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const { playerPosition } = useGameStore();
  
  // Position relative to media but facing player
  const position = useMemo(() => ({
    x: media.position.x * 0.5, // Slightly towards center
    y: media.position.y + 1.8,
    z: media.position.z,
  }), [media.position]);

  const handleVote = () => {
    if (!hasVoted) {
      onVote(media.id);
      setHasVoted(true);
    }
  };

  return (
    <Html
      center
      position={[position.x, position.y, position.z]}
      style={{
        pointerEvents: 'auto',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div 
        className="relative p-4 min-w-[220px]"
        style={{
          background: 'rgba(13, 27, 13, 0.95)',
          border: '1px solid #33ff00',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(51, 255, 0, 0.3)',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: '#33ff00' }}
        >
          <X size={16} />
        </button>

        {/* Scanlines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 1px, transparent 1px, transparent 2px)',
          }}
        />

        <div className="relative z-10">
          <p 
            className="text-xs font-mono mb-2 text-center"
            style={{ color: '#33ff00', opacity: 0.7 }}
          >
            PROXIMITY DETECTED
          </p>
          
          <h3 
            className="text-sm font-mono mb-3 text-center"
            style={{ 
              color: '#33ff00',
              textShadow: '0 0 5px #33ff00',
            }}
          >
            {media.title}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <span 
              className="text-xs font-mono"
              style={{ color: '#33ff00' }}
            >
              VOTES:
            </span>
            <span 
              className="text-lg font-mono font-bold"
              style={{ 
                color: '#33ff00',
                textShadow: '0 0 10px #33ff00',
              }}
            >
              {media.votes + (hasVoted ? 1 : 0)}
            </span>
          </div>

          <button
            onClick={handleVote}
            disabled={hasVoted}
            className="w-full py-2 px-4 flex items-center justify-center gap-2 font-mono text-sm transition-all duration-200"
            style={{
              background: hasVoted ? 'rgba(51, 255, 0, 0.2)' : 'rgba(51, 255, 0, 0.1)',
              color: '#33ff00',
              border: '1px solid #33ff00',
              textShadow: '0 0 5px #33ff00',
              cursor: hasVoted ? 'default' : 'pointer',
              opacity: hasVoted ? 0.6 : 1,
            }}
          >
            <Heart 
              size={16} 
              fill={hasVoted ? '#33ff00' : 'none'} 
            />
            {hasVoted ? 'VOTED!' : 'VOTE'}
          </button>

          {hasVoted && (
            <p 
              className="text-xs font-mono mt-2 text-center"
              style={{ color: '#33ff00', opacity: 0.6 }}
            >
              THANK YOU
            </p>
          )}
        </div>

      </div>
    </Html>
  );
}
