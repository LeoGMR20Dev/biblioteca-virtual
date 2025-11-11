import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';
import { BookCategory } from '../../interfaces/book.interface';
import { v4 as uuidv4 } from 'uuid';
import { isbnValidator } from '../../../../shared/validators/isbnValidator';

@Component({
  selector: 'book-add',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookAddComponent {
  private fb = inject(FormBuilder);
  private booksService = inject(BooksService);
  private router = inject(Router);

  public bookForm: FormGroup;
  public bookCategories = Object.values(BookCategory);
  public isSubmitting = false;
  public previewImage = signal<string | undefined>(undefined);
  @ViewChild('imageCoverInput') imageCoverInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.bookForm = this.fb.group({
      id: [uuidv4()],
      isbn: ['', [Validators.required, isbnValidator()]],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      category: [BookCategory.TERROR, [Validators.required]],
      price: [null, [Validators.min(0.1), Validators.max(100000)]],
      authorFullname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      yearPublication: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      physicalStock: [null, [Validators.min(1), Validators.max(10000)]],
      imageCover: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.isSubmitting = true;

      this.booksService.addBook(this.bookForm.value).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Error al registrar el libro', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  /* Event to convert file to base64 */

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      this.bookForm.patchValue({ imageCover: base64 });
      this.previewImage.set(base64);
    };

    reader.readAsDataURL(file);
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }

  onClear(): void {
    this.bookForm.reset({
      id: uuidv4(),
      category: BookCategory.TERROR,
    });
    this.previewImage.set(undefined);
    this.imageCoverInput.nativeElement.value = '';
  }

  getErrorMessage(fieldName: string, textForDisplay: string): string {
    const control = this.bookForm.get(fieldName);

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

    if (control?.hasError('min')) {
      const minCharacters = control.errors?.['min'].min;

      return `${textForDisplay} debe ser igual o  mayor a ${minCharacters}`;
    }

    if (control?.hasError('max')) {
      const maxCharacters = control.errors?.['max'].max;

      return `${textForDisplay} debe ser igual o menor a ${maxCharacters}`;
    }

    if (control?.hasError('isbn')) {
      return `El formato ingresado para el código ISBN es incorrecto`;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.bookForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
