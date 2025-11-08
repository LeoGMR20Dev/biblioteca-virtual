import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';
import { BookCategory } from '../../interfaces/book.interface';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'book-add',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-add.component.html',
  styleUrl: './book-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookAddComponent {
  private fb = inject(FormBuilder);
  private booksService = inject(BooksService);
  private router = inject(Router);

  public bookForm: FormGroup;
  public bookCategories = Object.values(BookCategory);
  public isSubmitting = false;

  constructor() {
    this.bookForm = this.fb.group({
      id: [uuidv4()],
      isbn: ['', [Validators.required]],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      category: [BookCategory.ADVENTURE, [Validators.required]],
      price: [null, [Validators.min(0.1), Validators.max(100000)]],
      physicalStock: [null, [Validators.min(1), Validators.max(10000)]],
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
}
