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
];
