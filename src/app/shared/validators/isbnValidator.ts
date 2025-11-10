import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isbnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.replace(/-/g, '');

    if (!value) return null;

    if (value.length === 10 && /^[0-9]{9}[0-9X]$/.test(value)) {
      return null;
    }

    if (value.length === 13 && /^[0-9]{13}$/.test(value)) {
      return null;
    }

    return { isbn: true };
  };
}
