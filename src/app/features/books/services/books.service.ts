import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from '../interfaces/book.interface';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private httpRequest = inject(HttpClient);

  public url: string = 'http://localhost:3000/books';

  getBooks = (): Observable<IBook[]> => this.httpRequest.get<IBook[]>(this.url);

  getBookById = (id: string): Observable<IBook> =>
    this.httpRequest.get<IBook>(`${this.url}/${id}`);

  addBook = (book: IBook): Observable<IBook> =>
    this.httpRequest.post<IBook>(this.url, book);

  updateBook = (id: string, book: IBook): Observable<IBook> =>
    this.httpRequest.put<IBook>(`${this.url}/${id}`, book);

  deleteBook = (id: string): Observable<void> =>
    this.httpRequest.delete<void>(`${this.url}/${id}`);
}
