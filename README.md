# The Poolrooms - Hall of Fame

An immersive 3D gallery experience set in a liminal poolroom environment. Built with Next.js, Three.js, and React Three Fiber.

![Poolrooms Concept](https://img.shields.io/badge/POOLROOMS-HALL%20OF%20FAME-blue?style=for-the-badge)

## Features

- 🏊 **Poolrooms Environment**: Infinite corridor with blue water, tile floors, and concrete walls
- 🖼️ **Immersive Gallery**: Floating CRT screens for images, retro TV sets for videos
- 🎮 **FPS Controls**: Scroll to move forward/backward through the corridor
- 🗳️ **Voting System**: Vote for your favorite media when you approach them
- 🎵 **Audio Experience**: Ambient drone, tile footsteps, retro UI sounds
- 📱 **Desktop Only**: Optimized for desktop browsers with keyboard/mouse

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **3D Rendering**: Three.js + React Three Fiber + Drei
- **State Management**: Zustand
- **Audio**: Howler.js
- **Storage**: Uploadthing (media), Supabase (votes)
- **Styling**: Tailwind CSS + Custom shaders

## Getting Started

### Prerequisites

- Node.js 18+
- Uploadthing account
- Supabase account (for votes)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hall-of-fame.git
cd hall-of-fame
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
UPLOADTHING_TOKEN=your_uploadthing_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Controls

| Action | Input |
|--------|-------|
| Move Forward | Scroll Down |
| Move Backward | Scroll Up |
| View Media | Click on CRT/TV |
| Close Media | Click ✕ or outside |
| Vote | Approach media + Click Vote button |

## Project Structure

```
app/
├── api/
│   ├── media/          # Fetch media list
│   ├── vote/           # Handle votes
│   └── uploadthing/    # Upload configuration
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── backrooms/
│   ├── PoolCorridor.tsx      # Main 3D environment
│   ├── FloatingCRT.tsx       # Image displays
│   ├── TVSet.tsx             # Video displays
│   ├── FloatingViewer.tsx    # Media viewer overlay
│   ├── ProximityVote.tsx     # Voting UI
│   ├── FirstPersonController.tsx
│   ├── AudioManager.tsx
│   ├── TitleScreen.tsx
│   └── Scene.tsx
└── DesktopCheck.tsx

hooks/
├── useScrollMovement.ts
├── useProximity.ts
└── useAudio.ts

stores/
└── gameStore.ts

types/
└── index.ts
```

## Customization

### Adding Media

1. Upload images/videos to Uploadthing via the admin interface
2. Media will automatically appear in the corridor
3. Or manually add to the database

### Theming

Edit the tailwind config to change colors:
- `pool.water`: Water color
- `pool.tile`: Floor tile color
- `pool.wall`: Wall color
- `crt.glow`: CRT screen glow color

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Self-Hosted

```bash
npm run build
npm start
```

## Future Enhancements

- [ ] Multiplayer support (see other visitors)
- [ ] More liminal spaces (backrooms, poolrooms, etc.)
- [ ] VR support
- [ ] Dynamic lighting based on time of day
- [ ] Easter eggs scattered throughout

## Credits

- Built with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Inspired by [The Backrooms](https://en.wikipedia.org/wiki/The_Backrooms) and Poolrooms
- Audio: [freesound.org](https://freesound.org)

## License

MIT License - feel free to use this for your own projects!
