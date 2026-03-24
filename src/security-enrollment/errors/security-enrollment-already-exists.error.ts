export class SecurityEnrollmentAlreadyExistsError extends Error {
  constructor(message = 'Security enrollment already exists') {
    super(message);
    this.name = 'SecurityEnrollmentAlreadyExistsError';
  }
}
