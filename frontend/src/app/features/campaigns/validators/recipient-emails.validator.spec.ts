import { FormControl } from '@angular/forms';
import { recipientEmailsValidator } from './recipient-emails.validator';

describe('recipientEmailsValidator', () => {
  const validator = recipientEmailsValidator();

  it('accepts a list of valid unique emails', () => {
    const control = new FormControl('a@test.com\nb@test.com');
    expect(validator(control)).toBeNull();
  });

  it('rejects an empty list', () => {
    const control = new FormControl('');
    expect(validator(control)).toEqual({ required: true });
  });

  it('rejects a blank list of whitespace', () => {
    const control = new FormControl('   \n  ');
    expect(validator(control)).toEqual({ required: true });
  });

  it('rejects an invalid email address', () => {
    const control = new FormControl('not-an-email');
    expect(validator(control)).toEqual({ invalidEmail: 'not-an-email' });
  });

  it('rejects case-insensitive duplicate emails', () => {
    const control = new FormControl('a@test.com\nA@TEST.COM');
    expect(validator(control)).toEqual({ duplicates: ['A@TEST.COM'] });
  });
});
