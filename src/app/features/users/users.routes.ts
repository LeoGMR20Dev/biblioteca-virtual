import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/users-list/users-list.component'),
  },
  {
    path: 'add',
    loadComponent: () => import('./components/user-add/user-add.component'),
  },
  {
    path: ':id',
    loadComponent: () => import('./components/user-by-id/user-by-id.component'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default userRoutes;
