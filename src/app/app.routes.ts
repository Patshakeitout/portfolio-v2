import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { LegalNoticeComponent } from './features/legal-notice/legal-notice';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'legal-notice',
    loadComponent: () => import('./features/legal-notice/legal-notice').then(m => m.LegalNoticeComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
