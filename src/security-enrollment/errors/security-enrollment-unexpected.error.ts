export class SecurityEnrollmentUnexpectedError extends Error {
  constructor(message = 'Unexpected error during security enrollment') {
    super(message);
    this.name = 'SecurityEnrollmentUnexpectedError';
  }
}
