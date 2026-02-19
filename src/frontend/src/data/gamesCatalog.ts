export interface GameMetadata {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  controls: string[];
}

export const gamesCatalog: GameMetadata[] = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake game - eat food, grow longer, and avoid hitting yourself or the walls!',
    thumbnail: '/assets/generated/snake-preview.dim_400x300.png',
    controls: ['WASD or Arrow Keys', 'Space to Pause'],
  },
  {
    id: 'pong',
    title: 'Pong',
    description: 'Retro paddle game - keep the ball in play and score points against the AI opponent.',
    thumbnail: '/assets/generated/pong-preview.dim_400x300.png',
    controls: ['W/S or ↑/↓', 'Space to Start'],
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Break all the bricks with your ball - classic arcade brick-breaking action!',
    thumbnail: '/assets/generated/breakout-preview.dim_400x300.png',
    controls: ['A/D or ← →', 'Space to Launch'],
  },
  {
    id: 'cookieclicker',
    title: 'Cookie Clicker',
    description: 'Click cookies and purchase upgrades to build your cookie empire. Buy auto-clickers, grandmas, farms, and more to generate cookies automatically!',
    thumbnail: '/assets/generated/cookie-thumb.dim_200x150.png',
    controls: ['Mouse to Click', 'Scroll to Browse Shop'],
  },
  {
    id: 'assembly',
    title: 'Mechanical Assembly',
    description: 'Build complex machines in 3D! Drag and drop parts, snap them together, and complete assemblies before time runs out. Features multiple levels and local multiplayer mode.',
    thumbnail: '/assets/generated/assembly-thumbnail.dim_400x300.png',
    controls: ['Mouse to Drag Parts', 'R/E to Rotate', 'Click to Place'],
  },
];
