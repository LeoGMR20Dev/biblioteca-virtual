import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import BookAddComponent from './book-add.component';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';
import { BookCategory, IBook } from '../../interfaces/book.interface';
import { of, throwError } from 'rxjs';
import { ElementRef } from '@angular/core';

describe('BookAdd Component', () => {
  let component: BookAddComponent;
  let fixture: ComponentFixture<BookAddComponent>;
  let booksService: jasmine.SpyObj<BooksService>;
  let router: jasmine.SpyObj<Router>;

  const mockId = '550e8400-e29b-41d4-a716-446655440000';

  const mockBook: IBook = {
    id: mockId,
    isbn: '9780061120084',
    title: 'Matar a un ruiseñor',
    category: BookCategory.ADVENTURE,
    authorFullname: 'Harper Lee',
    price: 18.99,
    yearPublication: 1960,
    physicalStock: 12,
    imageCover: 'https://tunovela.es/wp-content/uploads/81HwOsy48kL.jpg',
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('BooksService', ['addBook']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BookAddComponent],
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

    fixture = TestBed.createComponent(BookAddComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initializate isSubmitting as false', () => {
    expect(component.isSubmitting).toBeFalse();
  });

  it('should navigate to books list page and execute addBook when submitting the add form', fakeAsync(() => {
    component.bookForm.patchValue(mockBook);
    booksService.addBook.and.returnValue(of(mockBook));
    expect(component.bookForm.valid).toBeTrue();
    component.onSubmit();

    expect(component.isSubmitting).toBeTrue();
    tick();
    expect(booksService.addBook).toHaveBeenCalledWith(component.bookForm.value);
    expect(router.navigate).toHaveBeenCalledWith(['/books']);
  }));

  it('should not navigate to books list page when the add form is invalid', () => {
    component.bookForm.patchValue({ ...mockBook, title: 'sd' });
    expect(component.bookForm.valid).toBeFalse();

    component.onSubmit();

    expect(booksService.addBook).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not call addBook if the submit fails', fakeAsync(() => {
    component.bookForm.patchValue(mockBook);

    booksService.addBook.and.returnValue(
      throwError(() => new Error('Error al registrar el libro'))
    );

    spyOn(console, 'error');

    expect(component.bookForm.valid).toBeTrue();
    component.onSubmit();
    tick();

    expect(component.isSubmitting).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();

    expect(console.error).toHaveBeenCalledWith(
      'Error al registrar el libro',
      jasmine.any(Error)
    );
  }));

  it('should return to list books page when onCancel is called', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/books']);
  });

  it('should return to the original data when onClear is called', () => {
    component.bookForm.patchValue(mockBook);
    component.previewImage.set(mockBook.imageCover);
    component.imageCoverInput = {
      nativeElement: {
        value: mockBook.imageCover,
      },
    } as ElementRef<HTMLInputElement>;

    component.onClear();

    const formValue = component.bookForm.value;

    expect(formValue.id).toBeTruthy();
    expect(formValue.category).toBe(BookCategory.TERROR);

    expect(formValue.isbn).toBeNull();
    expect(formValue.title).toBeNull();
    expect(formValue.authorFullname).toBeNull();
    expect(formValue.price).toBeNull();
    expect(formValue.yearPublication).toBeNull();
    expect(formValue.physicalStock).toBeNull();
    expect(formValue.imageCover).toBeNull();

    expect(component.previewImage()).toBeUndefined();
    expect(component.imageCoverInput.nativeElement.value).toBe('');
  });
});
