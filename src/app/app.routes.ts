import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component'),
      },
      {
        path: 'books',
        loadChildren: () => import('./features/books/books.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
