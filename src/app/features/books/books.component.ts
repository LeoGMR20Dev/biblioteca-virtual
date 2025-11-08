import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'books',
  imports: [RouterOutlet],
  templateUrl: './books.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BooksComponent {}
