export class AuthTokenError extends Error {
  constructor() {
    super('Auth token is invalid');
    this.name = 'AuthTokenError';
    Object.setPrototypeOf(this, AuthTokenError.prototype);
  }
}
