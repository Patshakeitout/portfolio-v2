export type ProjectCta = 'sticker' | 'button';

export interface Project {
  slug: string;
  title: string;
  description: string;
  implementationDetails: string;
  duration: string;
  period: string;
  image: string;
  imageDetails: string;
  imageClass?: string;
  cta: ProjectCta;
  liveUrl?: string;
  repoUrl?: string;
  tech?: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: 'join',
    title: 'Join',
    description:
      'A Kanban-inspired task manager 📌 that keeps work flowing — drag tasks across columns, assign teammates, and group everything by category so nothing slips through.',
    implementationDetails:
      'Built as a single-page Angular app with Supabase as the backend for auth and data. Tasks are persisted in real time, drag-and-drop is implemented with the Angular CDK, and the UI is fully responsive down to mobile.',
    duration: '1 month',
    period: 'Feb 2026 – Mar 2025',
    image: '/images/join-laptop.png',
    imageDetails: 'images/join-board.png',
    imageClass: 'laptop',
    cta: 'sticker',
    repoUrl: 'https://github.com/Patshakeitout/join',
    liveUrl: 'https://patrickschauer.de/join',
    tech: ['Angular', 'TypeScript', 'SCSS', 'Supabase']
  },
  {
    slug: 'epl',
    title: 'El Pollo Loco',
    description:
      'A 2D side-scrolling platformer 🎮 written in object-oriented JavaScript — guide Pepe through the desert, grab coins and tabasco bottles, and take down the boss hen.',
    implementationDetails:
      'A side-scrolling platformer rendered on HTML5 Canvas. The architecture is class-based: separate entities for the player, enemies, collectibles, and the world, each with their own update/draw cycle driven by a central game loop.',
    duration: '2.5 months',
    period: 'Jan 2025 – Feb 2025',
    image: '/images/epl.png',
    imageDetails: '/images/epl.png',
    imageClass: 'epl',
    cta: 'button',
    repoUrl: 'https://github.com/Patshakeitout/el-pollo-loco',
    liveUrl: 'https://patrickschauer.de/el-pollo-loco',
    tech: ['HTML5 Canvas', 'JavaScript', 'OOP']
  },
];
