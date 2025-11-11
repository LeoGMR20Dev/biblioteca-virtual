import { ComponentFixture, TestBed } from '@angular/core/testing';
import BooksListComponent from './books-list.component';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';
import { BookCategory, IBook } from '../../interfaces/book.interface';
import { of } from 'rxjs';

describe('BooksList Component', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;
  let booksService: jasmine.SpyObj<BooksService>;
  let router: jasmine.SpyObj<Router>;

  const mockBooks: IBook[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      isbn: '978‑0‑06‑112008‑4',
      title: 'Matar a un ruiseñor',
      category: BookCategory.ADVENTURE,
      authorFullname: 'Harper Lee',
      price: 18.99,
      yearPublication: 1960,
      physicalStock: 12,
      imageCover: 'https://tunovela.es/wp-content/uploads/81HwOsy48kL.jpg',
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      isbn: '978‑0‑452‑28423‑4',
      title: '1984',
      category: BookCategory.SCIENCE_FICTION,
      authorFullname: 'George Orwell',
      price: 15.5,
      yearPublication: 1949,
      physicalStock: 8,
      imageCover:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGMA59ru39NgwyaQJW2tlHFOcXtBhptomRiQ&s',
    },
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('BooksService', [
      'getBooks',
      'deleteBook',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BooksListComponent],
      providers: [
        {
          provide: BooksService,
          useValue: serviceSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    }).compileComponents();

    booksService = TestBed.inject(BooksService) as jasmine.SpyObj<BooksService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    booksService.getBooks.and.returnValue(of(mockBooks));

    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load books on initialization', (done) => {
    fixture.detectChanges();

    component.books$.subscribe((res) => {
      expect(res).toEqual(mockBooks);
      expect(res.length).toBe(2);
      expect(booksService.getBooks).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should initializate isDeleting signal as null', () => {
    expect(component.isDeleting()).toBeNull();
  });

  it('should navigate to add books page when onAddBook is called', () => {
    component.onAddBook();
    expect(router.navigate).toHaveBeenCalledWith(['/books/add']);
  });

  it('should navigate to edit user page with correct id when onEditUser is called', () => {
    const userId = '123e4567-e89b-12d3-a456-426614474000';
    component.onEditBook(userId);

    expect(router.navigate).toHaveBeenCalledWith(['/books', userId]);
  });

  it('should delete book succesfully when confirmed', (done) => {
    const idToDelete = '123e4567-e89b-12d3-a456-426614174000';
    const updatedData = mockBooks.filter((u) => u.id !== idToDelete);

    spyOn(window, 'confirm').and.returnValue(true);

    booksService.deleteBook.and.returnValue(of(void 0));

    booksService.getBooks.and.returnValue(of(updatedData));

    component.onDeleteBook(idToDelete);

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Está seguro que desea eliminar este libro?'
    );

    expect(booksService.deleteBook).toHaveBeenCalledWith(idToDelete);

    expect(component.isDeleting()).toBeNull();

    component.books$.subscribe((book) => {
      expect(book.length).toBe(1);
      expect(booksService.getBooks).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should not delete book when confirmation is cancelled', () => {
    const idToDelete = '123e4567-e89b-12d3-a456-426614174000';

    spyOn(window, 'confirm').and.returnValue(false);

    component.onDeleteBook(idToDelete);

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Está seguro que desea eliminar este libro?'
    );

    expect(booksService.deleteBook).not.toHaveBeenCalled();
  });
});
