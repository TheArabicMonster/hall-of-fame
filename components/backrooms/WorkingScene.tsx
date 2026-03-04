'use client';

import { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Media } from '@/types';
import { useGameStore } from '@/stores/gameStore';
import { useAudio } from '@/hooks/useAudio';
import { StaticBackrooms, CORRIDOR_START, CORRIDOR_END } from './StaticBackrooms';
import { FixedLights } from './FixedLights';
import { EndWall } from './EndWall';

// Movement hook
function usePlayerMovement() {
  const { camera } = useThree();
  const { setPlayerPosition } = useGameStore();
  const targetZ = useRef(CORRIDOR_START);
  const currentZ = useRef(CORRIDOR_START);
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZ.current -= e.deltaY * 0.02;
      targetZ.current = Math.max(CORRIDOR_END + 10, Math.min(CORRIDOR_START, targetZ.current));
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);
  
  useFrame(() => {
    currentZ.current += (targetZ.current - currentZ.current) * 0.08;
    camera.position.set(0, 1.6, currentZ.current);
    camera.lookAt(0, 1.6, currentZ.current - 10);
    setPlayerPosition({ x: 0, y: 1.6, z: currentZ.current });
  });
  
  const resetToStart = () => {
    targetZ.current = CORRIDOR_START;
  };
  
  return { playerZ: currentZ.current, resetToStart };
}

// Generate media positions
// Real media from uploadthing
const REAL_MEDIA = [
  { name: "WIN_20260201_15_45_17_Pro.mp4", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4W1eDnXmUWO09jLn82gSDhQMEyt4Zm3acbl7qV", type: "video" },
  { name: "zehahahIGuess.mp4", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WZVSk0lvpnyT9oQJ15vZxYIuBVFk6SfM8dib2", type: "video" },
  { name: "wolverinw griffe.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4W2AOAKKkxWF4Kr9OJ5L3ZQbCXuh8gi6cUVNeY", type: "image" },
  { name: "2026-02-15 16-29-17.mp4", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WFVkg9mdiyuxJ0NKDFpcZwoaWMQnetH2dq1UE", type: "video" },
  { name: "d7d7e8082965c6c2ef63e0194e12f480.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WGVcCW17F4fMXb3QnN16ZzVBHu7YjsWyrUG8T", type: "image" },
  { name: "no brain all mouth.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WDf72XGacj7E6wXUiWelvtAL4Mso0OSqryCng", type: "image" },
  { name: "Screenshot 2026-02-17 17-53-26.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4Wgl16aFo8PHjIN3DybTWhF4AUXsc5G7lwxEO9", type: "image" },
  { name: "trident nails.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WRWDuAM4sjVeNAUHFQgafwGW354nyboziIc0m", type: "image" },
  { name: "e1388d94d7b42b95be019871878e3188.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WOrommYnD5LYXQs2hESAwIPGa6ZFkR3g9lvyj", type: "image" },
  { name: "b57d504da78b63482f92e85a1a07497f.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WPbolouT96BkDiuoTZYhCvVKXd4jcLmqSeEtw", type: "image" },
  { name: "7ce716dfc508e670f936853078d2f198.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WqgoWm3rIOlChZevVbxkKJ32FGwBc8E0WH6ga", type: "image" },
  { name: "ed115919ed5148232c0f201cac48dcb2.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WmuoRrC5pVC2r4LQfSD9y5NWl1wJTamixdZsb", type: "image" },
  { name: "ce twt qui dit de la merde.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WPshKJXT96BkDiuoTZYhCvVKXd4jcLmqSeEtw", type: "image" },
  { name: "620015b8d26c0e60acb192c00b8bef84.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WDSUD5macj7E6wXUiWelvtAL4Mso0OSqryCng", type: "image" },
  { name: "91fd202d9fcc142a2d7c4b405d985157.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WxQUjbhuMERwtK409DqCjAIyYJOgTdVokc6mL", type: "image" },
  { name: "mateen not quite my tempo.mp4", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4W2ipL3RkxWF4Kr9OJ5L3ZQbCXuh8gi6cUVNeY", type: "video" },
  { name: "speed+moi+hoche.gif", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WU2CqLugRq6s2uQbEHGc1lUy8DPiZofNAeOBh", type: "image" },
  { name: "8cfacb507517586eae3d67bd73726fbb.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4Wct7evkJwMIPAtW9FvOyKD03Homd5li7pxaTu", type: "image" },
  { name: "507d14552357c6cb4efe3bdddca387524a3.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WJUmeYu2SDj7RegYk6N1b4HCIZ8PxplfBaOsh", type: "image" },
  { name: "enough+.gif", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WvWGKs6h1O4WUMLRTCXFfNQ3leuyEbpYat2jA", type: "image" },
  { name: "vanilla horreur scp mateen.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4W2GmG5vkxWF4Kr9OJ5L3ZQbCXuh8gi6cUVNeY", type: "image" },
  { name: "9e564414c363e0d2ace59b09be22c756.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4Wh1gu5rxea08cj3TZLi1OWDJRYnwV7FxAKgEU", type: "image" },
  { name: "oh mince pas billy.mp4", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WaOr4y0P0m4LbstvkBoQJHAGNw3TZezXC2gpj", type: "video" },
  { name: "4d0e339e0eb22d1899c5ac259418479d.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WDAlQz9acj7E6wXUiWelvtAL4Mso0OSqryCng", type: "image" },
  { name: "IMG_3545.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4W7gRPwRKh8F9JSLyKDuNBPl1HVxmq4EgYcdRv", type: "image" },
  { name: "mordre+lèvre.gif", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WicThKKZwJNRtyxLm8r3lgZ4oecMX07aS1qjC", type: "image" },
  { name: "c18baa339bb89c998876fa27cc11cfad.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4W24gp7LkxWF4Kr9OJ5L3ZQbCXuh8gi6cUVNeY", type: "image" },
  { name: "IMG_3251.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WJwIvAO2SDj7RegYk6N1b4HCIZ8PxplfBaOsh", type: "image" },
  { name: "c+tro.gif", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WHb1TY6GzCTd2YjA98Q1BmVUWEa7o4IS3whiF", type: "image" },
  { name: "022esdvgasdfsga0b025dd1a3f7b7530304b25a0909.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4WQH5QZj6BEfxZAPqgV7WJ3XHItKevi4mGywuY", type: "image" },
  { name: "1 CHANCE BALL.png", url: "https://72y8mozbqb.ufs.sh/f/vuI8QAfh1O4W1AOkdtWO09jLn82gSDhQMEyt4Zm3acbl7qVB", type: "image" },
];

const ALL_MEDIA: Media[] = REAL_MEDIA.map((item, i) => ({
  id: String(i + 1),
  url: item.url,
  type: item.type as 'image' | 'video',
  title: item.name.replace(/\.[^/.]+$/, "").substring(0, 20), // Remove extension and limit length
  votes: Math.floor(Math.random() * 200),
  position: {
    x: i % 2 === 0 ? -3.5 : 3.5,
    y: 1.5 + (i % 3) * 0.4,
    z: CORRIDOR_START - 20 - (i * 30),
  },
  rotation: { x: 0, y: i % 2 === 0 ? 0.4 : -0.4, z: 0 },
}));

// Shared animation ref for all media
const mediaAnimations = new Map<string, { baseY: number; offset: number }>();
ALL_MEDIA.forEach(m => {
  mediaAnimations.set(m.id, { baseY: m.position.y, offset: parseInt(m.id) });
});

// Calculate visibility based on distance for fog fade-in effect
function getVisibility(dist: number): { opacity: number; lightIntensity: number } {
  // Full visibility within 5m
  if (dist < 5) return { opacity: 1, lightIntensity: 1 };
  // Fade in between 5m and 18m (silhouette visible before)
  if (dist < 18) {
    const fadeProgress = 1 - (dist - 5) / 13;
    return { 
      opacity: Math.max(0.2, fadeProgress * fadeProgress),
      lightIntensity: Math.max(0.1, fadeProgress * 0.8)
    };
  }
  // Just silhouette in fog
  return { opacity: 0.15, lightIntensity: 0.05 };
}

// Simple image display - NO useFrame
function CRTDisplay({ 
  media, 
  onClick, 
  floatY,
  distance
}: { 
  media: Media; 
  onClick: (m: Media) => void;
  floatY: number;
  distance: number;
}) {
  const { playClick } = useAudio();
  const anim = mediaAnimations.get(media.id)!;
  const visibility = getVisibility(distance);
  const [hasError, setHasError] = useState(false);
  
  const handleClick = () => {
    if (!hasError) {
      playClick();
      onClick(media);
    }
  };
  
  // Generate a color-based placeholder if image fails
  const placeholderColor = `#${(parseInt(media.id) * 137).toString(16).padStart(6, '0').slice(0, 6)}`;
  
  return (
    <group 
      position={[media.position.x, anim.baseY + floatY, media.position.z]}
      rotation={[media.rotation.x, media.rotation.y, media.rotation.z]}
    >
      <Html transform occlude position={[0, 0, 0]} style={{ width: '200px', height: '140px', pointerEvents: 'auto' }}>
        <div 
          onClick={handleClick}
          className="w-full h-full relative cursor-pointer flex items-center justify-center"
          style={{
            opacity: visibility.opacity,
            background: hasError ? placeholderColor : 'transparent',
          }}
        >
          {hasError ? (
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <div className="text-xs text-white/50 font-mono">{media.title}</div>
            </div>
          ) : (
            <img 
              src={media.url} 
              alt={media.title} 
              className="w-full h-full object-cover" 
              style={{ filter: 'contrast(1.1)' }}
              onError={() => setHasError(true)}
            />
          )}
        </div>
      </Html>
      
      {/* Screen light - attenuated by fog */}
      <pointLight position={[0, -0.8, 1.8]} color="#33ff00" intensity={0.8 * visibility.lightIntensity} distance={5} decay={1.5} />
      
      {/* Floor reflection - attenuated by fog */}
      <mesh position={[0, 0.02, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#33ff00" transparent opacity={0.15 * visibility.lightIntensity} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// TV Set - NO useFrame
function TVSet({ 
  media, 
  onClick, 
  isVisible,
  distance
}: { 
  media: Media; 
  onClick: (m: Media) => void;
  isVisible: boolean;
  distance: number;
}) {
  const { playClick } = useAudio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibility = getVisibility(distance);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    if (videoRef.current && !hasError) {
      if (isVisible) videoRef.current.play().catch(() => setHasError(true));
      else videoRef.current.pause();
    }
  }, [isVisible, hasError]);
  
  const handleClick = () => {
    if (!hasError) {
      playClick();
      onClick(media);
    }
  };
  
  // Generate a color-based placeholder if video fails
  const placeholderColor = `#${(parseInt(media.id) * 137 + 50).toString(16).padStart(6, '0').slice(0, 6)}`; 
  
  // If video has error, treat it as a static image placeholder
  if (hasError) {
    return (
      <group position={[media.position.x, media.position.y, media.position.z]} rotation={[0, media.rotation.y, 0]}>
        <Html transform occlude position={[0, 0, 0]} style={{ width: '220px', height: '150px', pointerEvents: 'auto' }}>
          <div 
            onClick={handleClick}
            className="w-full h-full relative cursor-pointer flex items-center justify-center"
            style={{ 
              opacity: visibility.opacity,
              background: placeholderColor,
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">📹</div>
              <div className="text-xs text-white/50 font-mono">{media.title}</div>
              <div className="text-[10px] text-white/30 font-mono mt-1">[OFFLINE]</div>
            </div>
          </div>
        </Html>
        <pointLight position={[0, -0.8, 1.5]} color="#ff0000" intensity={0.3 * visibility.lightIntensity} distance={3} decay={1.5} />
      </group>
    );
  }
  
  return (
    <group position={[media.position.x, media.position.y, media.position.z]} rotation={[0, media.rotation.y, 0]}>
      <Html transform occlude position={[0, 0, 0]} style={{ width: '220px', height: '150px', pointerEvents: 'auto' }}>
        <div onClick={handleClick} className="w-full h-full relative cursor-pointer" style={{ opacity: visibility.opacity }}>
          {!isVisible && visibility.opacity > 0.3 && (
            <div className="absolute inset-0 bg-black z-5 flex items-center justify-center">
              <span className="text-xs font-mono text-gray-500">NO SIGNAL</span>
            </div>
          )}
          <video 
            ref={videoRef} 
            src={media.url} 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover" 
            style={{ opacity: isVisible ? visibility.opacity : 0 }}
            onError={() => setHasError(true)}
          />
        </div>
      </Html>
      
      {/* Light attenuated by fog */}
      <pointLight position={[0, -0.8, 1.5]} color="#33ff00" intensity={(isVisible ? 0.7 : 0.1) * visibility.lightIntensity} distance={4} decay={1.5} />
      
      {/* Floor reflection attenuated by fog */}
      <mesh position={[0, 0.02, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 1.2]} />
        <meshBasicMaterial color="#33ff00" transparent opacity={(isVisible ? 0.12 : 0.03) * visibility.lightIntensity} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Media viewer
function MediaViewer({ media, onClose, playerZ }: { media: Media; onClose: () => void; playerZ: number }) {
  const { playClick } = useAudio();
  
  return (
    <group position={[0, 1.7, playerZ - 3]}>
      <Html center style={{ width: '600px', height: '450px', pointerEvents: 'auto' }}>
        <div className="w-full h-full p-6 relative" 
          style={{ background: 'linear-gradient(135deg, #0d1b0d 0%, #1a2e1a 100%)', border: '2px solid #33ff00', boxShadow: '0 0 40px rgba(51, 255, 0, 0.3)' }}>
          <button onClick={() => { playClick(); onClose(); }}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center font-mono text-lg"
            style={{ color: '#33ff00', border: '1px solid #33ff00', background: 'rgba(51, 255, 0, 0.1)' }}>
            ✕
          </button>
          <h2 className="text-xl font-mono text-center mb-4" style={{ color: '#33ff00', textShadow: '0 0 10px #33ff00' }}>
            &gt; {media.title}
          </h2>
          <div className="flex-1 flex items-center justify-center h-[320px]">
            {media.type === 'image' ? (
              <img src={media.url} alt={media.title} className="max-w-full max-h-full object-contain" style={{ boxShadow: '0 0 20px rgba(51, 255, 0, 0.2)' }} />
            ) : (
              <video src={media.url} controls autoPlay loop className="max-w-full max-h-full" />
            )}
          </div>
          <div className="flex justify-between mt-4 font-mono text-sm" style={{ color: '#33ff00' }}>
            <span>ID: {media.id} | {media.type.toUpperCase()}</span>
            <span>♥ {media.votes} VOTES</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Main scene
function SceneContent() {
  const { playerZ, resetToStart } = usePlayerMovement();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const { playStep } = useAudio();
  const lastStepZ = useRef(CORRIDOR_START);
  const mediaGroupRef = useRef<THREE.Group>(null);
  
  // Footstep sounds
  useFrame(() => {
    const dist = Math.abs(playerZ - lastStepZ.current);
    if (dist > 0.8) {
      playStep();
      lastStepZ.current = playerZ;
    }
    
    // Global animation for ALL media - single useFrame
    const time = performance.now() * 0.001;
    if (mediaGroupRef.current) {
      mediaGroupRef.current.children.forEach((child, i) => {
        const mediaId = ALL_MEDIA[i]?.id;
        if (!mediaId) return;
        const anim = mediaAnimations.get(mediaId);
        if (anim) {
          const floatY = Math.sin(time * 0.5 + anim.offset) * 0.08;
          child.position.y = anim.baseY + floatY;
        }
      });
    }
  });
  
  // Filter visible media - CRITICAL OPTIMIZATION
  const visibleMedia = useMemo(() => {
    return ALL_MEDIA.filter(m => {
      const dist = Math.abs(m.position.z - playerZ);
      const inFront = m.position.z < playerZ + 5;
      const notTooFarBehind = m.position.z > playerZ - 5;
      return dist < 35 && (inFront || notTooFarBehind);
    });
  }, [Math.floor(playerZ / 5)]); // Update every 5 units only
  
  return (
    <>
      <ambientLight intensity={0.25} color="#a08060" />
      <StaticBackrooms />
      <FixedLights />
      <EndWall onReturnToStart={resetToStart} />
      
      <group ref={mediaGroupRef}>
        {visibleMedia.map((media) => {
          const distance = Math.abs(media.position.z - playerZ);
          return media.type === 'image' ? (
            <CRTDisplay key={media.id} media={media} onClick={setSelectedMedia} floatY={0} distance={distance} />
          ) : (
            <TVSet key={media.id} media={media} onClick={setSelectedMedia} isVisible={distance < 25} distance={distance} />
          );
        })}
      </group>
      
      {selectedMedia && (
        <MediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} playerZ={playerZ} />
      )}
    </>
  );
}

export function WorkingScene() {
  return (
    <Canvas camera={{ position: [0, 1.6, CORRIDOR_START], fov: 75 }} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ background: '#1a1612' }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
