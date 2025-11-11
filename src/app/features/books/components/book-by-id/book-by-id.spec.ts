import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import BookByIdComponent from './book-by-id.component';
import { BooksService } from '../../services/books.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BookCategory, IBook } from '../../interfaces/book.interface';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';

describe('BookById Component', () => {
  let component: BookByIdComponent;
  let fixture: ComponentFixture<BookByIdComponent>;
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
  const mockBookChanged: IBook = {
    id: mockId,
    isbn: '9780061120084',
    title: 'Matar a un ruisenor',
    category: BookCategory.ADVENTURE,
    authorFullname: 'Harper Lee',
    price: 20,
    yearPublication: 1960,
    physicalStock: 20,
    imageCover: 'https://tunovela.es/wp-content/uploads/81HwOsy48kL.jpg',
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('BooksService', [
      'getBookById',
      'updateBook',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BookByIdComponent],
      providers: [
        {
          provide: BooksService,
          useValue: serviceSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (_: string) => mockId,
              },
            },
          },
        },
      ],
    }).compileComponents();

    booksService = TestBed.inject(BooksService) as jasmine.SpyObj<BooksService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    booksService.getBookById.and.returnValue(of(mockBook));

    fixture = TestBed.createComponent(BookByIdComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load book data on initialization', () => {
    fixture.detectChanges();

    expect(booksService.getBookById).toHaveBeenCalledWith(mockId);
    expect(component.bookForm.value).toEqual(mockBook);
  });

  it('should initializate isSubmitting as false', () => {
    expect(component.isSubmitting).toBeFalse();
  });

  it('should navigate to books list page when submitting the edit form', () => {
    booksService.updateBook.and.returnValue(of(mockBookChanged));

    fixture.detectChanges();

    component.bookForm.patchValue(mockBookChanged);
    expect(component.bookForm.valid).toBeTrue();
    component.onSubmit();

    expect(component.isSubmitting).toBeTrue();
    expect(booksService.updateBook).toHaveBeenCalledWith(
      mockId,
      mockBookChanged
    );
    expect(router.navigate).toHaveBeenCalledWith(['/books']);
  });

  it('should not navigate to books list page when the edit form is invalid', () => {
    component.bookForm.patchValue({ ...mockBookChanged, title: 'sd' });
    expect(component.bookForm.valid).toBeFalse();

    component.onSubmit();

    expect(booksService.updateBook).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not call updateBook when form is invalid', () => {
    component.bookForm.reset();
    component.onSubmit();

    expect(booksService.updateBook).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return to list books page when onCancel is called', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/books']);
  });

  it('should return to the original data when onClear is called', () => {
    const imageToReplace =
      'https://i.pinimg.com/736x/18/3e/24/183e24b12211121a82bfe80829d0c945.jpg';
    fixture.detectChanges();

    component.bookForm.patchValue({
      title: 'Titulo diferente',
      price: 50,
      imageCover: imageToReplace,
    });
    component.previewImage.set(imageToReplace);
    component.imageCoverInput = {
      nativeElement: {
        value: imageToReplace,
      },
    } as ElementRef<HTMLInputElement>;

    component.onClear();

    expect(component.bookForm.value).toEqual(mockBook);
    expect(component.previewImage()).toBe(component.bookOgData?.imageCover);
    expect(component.imageCoverInput.nativeElement.value).toBe('');
  });
});
