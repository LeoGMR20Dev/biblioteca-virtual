import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '../../interfaces/user.interface';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'users-list',
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './users-list.component.html',
})
export default class UsersListComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);

  public users$: Observable<IUser[]> = this.usersService.getUsers();
  public isDeleting = signal<string | null>(null);

  onAddUser(): void {
    this.router.navigate(['/users/add']);
  }

  onEditUser(id: string): void {
    this.router.navigate(['/users', id]);
  }

  onDeleteUser(id: string): void {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this.isDeleting.set(id);

      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.users$ = this.usersService.getUsers();
          this.isDeleting.set(null);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.isDeleting.set(null);
          alert('Error al eliminar el usuario');
        },
      });
    }
  }
}
