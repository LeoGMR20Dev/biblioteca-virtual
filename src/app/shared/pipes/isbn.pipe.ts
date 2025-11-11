import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isbn',
})
export class IsbnPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length === 10) {
      return `${value[0]}-${value.slice(1, 4)}-${value.slice(4, 9)}-${
        value[9]
      }`;
    }

    if (value.length === 13) {
      return `${value.slice(0, 3)}-${value[3]}-${value.slice(
        4,
        7
      )}-${value.slice(7, 12)}-${value[12]}`;
    }

    return value;
  }
}
