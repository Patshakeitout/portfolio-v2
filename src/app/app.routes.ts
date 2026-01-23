import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { LegalNotice } from './features/legal-notice/legal-notice';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'legal-notice',
    loadComponent: () => import('./features/legal-notice/legal-notice').then(m => m.LegalNotice)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
