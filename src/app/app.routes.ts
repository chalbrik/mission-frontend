import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/login/login').then(m => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/layout/layout').then(m => m.Layout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'calendar',
        loadComponent: () => import('./modules/calendar/calendar').then(m => m.Calendar),
      },
    ]
  }

];
