export class SecurityEnrollmentUnavailableError extends Error {
  constructor(message = 'Security enrollment provider is unavailable') {
    super(message);
    this.name = 'SecurityEnrollmentUnavailableError';
  }
}