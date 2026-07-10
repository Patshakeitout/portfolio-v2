# Portfolio

Personal developer portfolio built with Angular — a single-page application showcasing my projects, skills, and contact information.

## Features

- **Bilingual (EN / DE)** — full i18n via ngx-translate with language-aware routing
- **Responsive design** — optimized layouts from mobile to desktop
- **Custom cursor** — interactive cursor component for desktop
- **Project showcase** — detail views for featured projects
- **Contact form** — with validation
- **Legal pages** — imprint & privacy policy

## Tech Stack

- [Angular 20](https://angular.dev/) (standalone components, signals)
- TypeScript
- SCSS (design tokens via variables & mixins)
- [ngx-translate](https://github.com/ngx-translate/core)

## Getting Started

```bash
# install dependencies
npm install

# start dev server (opens http://localhost:4200)
npm start
```

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm start`     | Dev server with live reload        |
| `npm run build` | Production build into `dist/`      |
| `npm test`      | Unit tests (Karma + Jasmine)       |

## Project Structure

```
src/app/
├── core/       # layout (header, footer), services, guards
├── features/   # page sections (hero, about, skills, projects, contact, …)
└── shared/     # reusable UI components & styles
```
