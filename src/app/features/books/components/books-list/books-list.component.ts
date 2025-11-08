import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IBook } from '../../interfaces/book.interface';

@Component({
  selector: 'books-list',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css',
})
export default class BooksListComponent {
  private booksService = inject(BooksService);
  private router = inject(Router);

  public books$: Observable<IBook[]> = this.booksService.getBooks();
  public isDeleting = signal<string | null>(null);

  onAddBook(): void {
    this.router.navigate(['/books/add']);
  }

  onEditBook(id: string): void {
    this.router.navigate(['/books', id]);
  }

  onDeleteBook(id: string): void {
    if (confirm('¿Está seguro que desea eliminar este libro?')) {
      this.isDeleting.set(id);

      this.booksService.deleteBook(id).subscribe({
        next: () => {
          this.books$ = this.booksService.getBooks();
          this.isDeleting.set(null);
        },
        error: (error) => {
          console.error('Error deleting book', error);
          this.isDeleting.set(null);
          alert('Error al eliminar el registro del libro');
        },
      });
    }
  }
}
