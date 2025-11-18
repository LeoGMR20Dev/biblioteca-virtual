import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { Role } from '../../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserAddComponent {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private router = inject(Router);

  public userForm: FormGroup;
  public roles = Object.values(Role);
  public isSubmitting = false;

  constructor() {
    this.userForm = this.fb.group({
      id: [uuidv4()],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(320),
        ],
      ],
      role: [Role.USER, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      this.usersService.addUser(this.userForm.value).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error al añadir el usuario', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  getErrorMessage(fieldName: string, textForDisplay: string): string {
    const control = this.userForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${textForDisplay} es requerido`;
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${textForDisplay} debe tener al menos ${minLength} caracteres`;
    }

    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `${textForDisplay} debe tener ${maxLength} caracteres como máximo`;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
