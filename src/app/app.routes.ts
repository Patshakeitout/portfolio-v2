import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'legal-notice',
    loadComponent: () =>
      import('./features/legal-notice/legal-notice').then(module => module.LegalNoticeComponent)
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./features/project-details/project-details').then(module => module.ProjectDetails)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
