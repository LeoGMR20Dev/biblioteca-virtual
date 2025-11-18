import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component'),
        canActivate: [authGuard],
      },
      {
        path: 'books',
        loadChildren: () => import('./features/books/books.routes'),
        canActivate: [authGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes'),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./core/auth/components/login/login.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
