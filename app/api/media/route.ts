import { NextResponse } from 'next/server';
import { Media } from '@/types';

// Mock data - replace with Supabase query later
const mockMedia: Media[] = [
  {
    id: '1',
    url: 'https://utfs.io/f/mock-image-1.jpg',
    type: 'image',
    title: 'Memory 01',
    votes: 42,
    position: { x: -2, y: 2, z: -10 },
    rotation: { x: 0, y: 0.3, z: 0 },
  },
  {
    id: '2',
    url: 'https://utfs.io/f/mock-video-1.mp4',
    type: 'video',
    title: 'Moment 02',
    votes: 28,
    position: { x: 2, y: 1.5, z: -20 },
    rotation: { x: 0, y: -0.2, z: 0 },
  },
  {
    id: '3',
    url: 'https://utfs.io/f/mock-image-2.jpg',
    type: 'image',
    title: 'Vision 03',
    votes: 156,
    position: { x: -2.5, y: 2.2, z: -30 },
    rotation: { x: 0, y: 0.4, z: 0 },
  },
  {
    id: '4',
    url: 'https://utfs.io/f/mock-image-3.jpg',
    type: 'image',
    title: 'Dream 04',
    votes: 73,
    position: { x: 2.2, y: 1.8, z: -40 },
    rotation: { x: 0, y: -0.3, z: 0 },
  },
  {
    id: '5',
    url: 'https://utfs.io/f/mock-video-2.mp4',
    type: 'video',
    title: 'Clip 05',
    votes: 91,
    position: { x: -1.8, y: 2, z: -50 },
    rotation: { x: 0, y: 0.2, z: 0 },
  },
];

export async function GET() {
  // TODO: Fetch from Supabase
  return NextResponse.json(mockMedia);
}
