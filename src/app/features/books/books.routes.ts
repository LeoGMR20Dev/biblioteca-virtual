import { Routes } from '@angular/router';

export const booksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/books-list/books-list.component'),
  },
  {
    path: ':id',
    loadComponent: () => import('./components/book-by-id/book-by-id.component'),
  },
  {
    path: 'add',
    loadComponent: () => import('./components/book-add/book-add.component'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default booksRoutes;
