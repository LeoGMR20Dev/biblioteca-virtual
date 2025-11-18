import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Role } from '../../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'user-by-id',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-by-id.component.html',
})
export default class UserByIdComponent {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public userForm: FormGroup;
  public roles = Object.values(Role);
  public isSubmitting = false;
  public isLoading = true;
  public userId: string = '';

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

  ngOnInit(): void {
    this.userId = String(this.route.snapshot.paramMap.get('id'));

    if (this.userId) {
      this.loadData();
    }
  }

  loadData(): void {
    this.usersService.getUserById(this.userId).subscribe({
      next: (user) => {
        if (user) {
          this.userForm.patchValue(user);
          this.isLoading = false;
        } else {
          this.router.navigate(['/users']);
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario', err);
        this.router.navigate(['/users']);
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      this.usersService.updateUser(this.userId, this.userForm.value).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error al editar el usuario', err);
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
