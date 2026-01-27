import { Routes } from '@angular/router';
import { Home } from './features/home/home.component';
import { LegalNotice } from './features/legal-notice/legal-notice.component';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'legal-notice',
    loadComponent: () => import('./features/legal-notice/legal-notice.component').then(m => m.LegalNotice)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
