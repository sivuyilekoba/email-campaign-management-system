import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates a newline-separated list of recipient email addresses.
 * Returns:
 *  - { required: true } when the list is empty
 *  - { invalidEmail: '<value>' } when a line is not a valid email
 *  - { duplicates: string[] } when the list contains case-insensitive duplicates
 */
export function recipientEmailsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = typeof control.value === 'string' ? control.value : '';
    const emails = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (emails.length === 0) {
      return { required: true };
    }

    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const email of emails) {
      if (!EMAIL_PATTERN.test(email)) {
        return { invalidEmail: email };
      }

      const key = email.toLowerCase();
      if (seen.has(key)) {
        duplicates.add(email);
      }
      seen.add(key);
    }

    if (duplicates.size > 0) {
      return { duplicates: [...duplicates] };
    }

    return null;
  };
}
