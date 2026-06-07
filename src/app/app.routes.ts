import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { langGuard } from './core/guards/lang.guard';
import { detectInitialLang } from './core/services/language.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => detectInitialLang()
  },
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
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
        path: 'privacy-policy',
        loadComponent: () =>
          import('./features/privacy-policy/privacy-policy').then(module => module.PrivacyPolicyComponent)
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
    ]
  },
  {
    path: '**',
    redirectTo: () => detectInitialLang()
  }
];
