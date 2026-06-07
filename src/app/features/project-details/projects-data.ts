export type ProjectCta = 'sticker' | 'button';

export interface Project {
  slug: string;
  title: string;
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
    image: '/images/epl.png',
    imageDetails: '/images/epl.png',
    imageClass: 'epl',
    cta: 'button',
    repoUrl: 'https://github.com/Patshakeitout/el-pollo-loco',
    liveUrl: 'https://patrickschauer.de/el-pollo-loco',
    tech: ['HTML5 Canvas', 'JavaScript', 'OOP']
  },
];
