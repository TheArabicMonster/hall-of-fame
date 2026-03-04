'use client';

import { DesktopCheck } from '@/components/DesktopCheck';
import { WorkingScene } from '@/components/backrooms/WorkingScene';
import { TitleScreen } from '@/components/backrooms/TitleScreen';
import { useGameStore } from '@/stores/gameStore';

export default function Home() {
  const { isPlaying } = useGameStore();

  return (
    <DesktopCheck>
      <main className="fixed inset-0">
        {!isPlaying ? <TitleScreen /> : <WorkingScene />}
      </main>
    </DesktopCheck>
  );
}
