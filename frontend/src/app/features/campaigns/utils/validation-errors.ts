import { HttpErrorResponse } from '@angular/common/http';

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Converts a Laravel 422 validation response body
 * ({ error, details: { field: [messages] } }) into a flat list of field errors.
 */
export function extractFieldErrors(error: unknown): FieldError[] {
  if (!(error instanceof HttpErrorResponse) || error.status !== 422) {
    return [];
  }

  const details = error.error?.details;

  if (!details || typeof details !== 'object') {
    return [];
  }

  return Object.entries(details as Record<string, string[]>).map(([field, messages]) => ({
    field,
    message: Array.isArray(messages) ? messages.join(' ') : String(messages),
  }));
}
