import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
