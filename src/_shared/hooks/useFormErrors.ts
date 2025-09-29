'use client';

import { FieldErrors, useFormContext } from 'react-hook-form';

type FormattedErrors = {
  [key: string]: string;
};

// Type guard to check if a value is a FieldError with a message
function isFieldErrorWithMessage(value: unknown): value is { message: string } {
  return (
    !!value &&
    typeof value === 'object' &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  );
}

// Recursive function to flatten errors
const flattenErrors = (
  errors: FieldErrors,
  parentKey: string = '',
): FormattedErrors => {
  return Object.entries(errors).reduce(
    (acc, [key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (isFieldErrorWithMessage(value)) {
        acc[newKey] = value.message;
      } else if (value && typeof value === 'object') {
        Object.assign(acc, flattenErrors(value as FieldErrors, newKey));
      }

      return acc;
    },
    {} as FormattedErrors,
  );
};

export const useFormErrors = (): FormattedErrors | null => {
  const context = useFormContext();

  if (!context) {
    return null;
  }

  const {
    formState: { errors },
  } = context;

  if (Object.keys(errors).length === 0) {
    return null;
  }

  const formattedErrors = flattenErrors(errors);

  if (Object.keys(formattedErrors).length === 0) {
    return null;
  }

  return formattedErrors;
};
