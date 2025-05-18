class UserError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  
  class UserDisabledError extends UserError {
    constructor(message) {
      super(message || 'Account is deactivated or deleted(soft delete)');
      this.statusCode = 403;
    }
  }

  class UserDeactivatedError extends UserDisabledError{
    constructor(message) {
      super(message || 'Account is deactivated');
      this.statusCode = 403;
    }
  }

  
  class InvalidCredentialsError extends UserError {
    constructor(message) {
      super(message || 'Invalid credentials');
      this.statusCode = 401;
    }
  }
  
  class UserNotFoundError extends UserError {
    constructor(message) {
      super(message || 'Not found');
      this.statusCode = 404;
    }
  }
  
  class InvalidPasswordError extends UserError {
    constructor(message) {
      super(message || 'Invalid password, must be at least 8 characters');
      this.statusCode = 400;
    }
  }

  class InvalidEmailError extends UserError {
    constructor(message) {
      super(message || 'Invalid email, must be a valid email address');
      this.statusCode = 400;
    }
  }

  
  class EmailAlreadyInUseError extends UserError {
    constructor(message) {
      super(message || 'Email already in use');
      this.statusCode = 400;
    }
  }

  class InvalidNameError extends UserError {
    constructor(message) {
      super(message || 'Invalid name, must be at least 3 characters long');
      this.statusCode = 400;
    }
  }

  class InvalidEmailValidationError extends UserError {
    constructor(message) {
      super(message || 'Email not validated, please validate your email before logging in or JWT is old');
      this.statusCode = 400;
    }
  }

  class EmailAlreadyValidatedError extends UserError {
    constructor(message) {
      super(message || 'Email already validated');
      this.statusCode = 400;
    }
  }

  class InvalidRouteCompanyError extends UserError {
    constructor(message) {
      super(message || 'Invalid route, your account is a company');
      this.statusCode = 403;
    }
  }

  class InvalidRouteUserError extends UserError {
    constructor(message) {
      super(message || 'Invalid route, your account is a user');
      this.statusCode = 403;
    }
  }

  class InvalidJWTError extends UserError {
    constructor(message) {
      super(message || 'Invalid JWT');
      this.statusCode = 401;
    }
  }

  class MissingJWTError extends UserError {
    constructor(message) {
      super(message || 'Missing JWT');
      this.statusCode = 401;
    }
  }

  class InvalidEmailSendingError extends UserError {
    constructor(message) {
      super(message || 'An error occurred during sending email, user creation rolled back.');
      this.statusCode = 400;
    }
  }

  class InvalidRecoveryCodeError extends UserError {
    constructor(message) {
      super(message || 'Invalid recovery code');
      this.statusCode = 400;
    }
  }

  class InvalidEmailCodeError extends UserError {
    constructor(message) {
      super(message || 'Invalid email code');
      this.statusCode = 400;
    }
  }

  class InvalidDatabaseError extends UserError {
    constructor(message) {
      super(message || 'Database error, table not found or an error occurred while creating the table');
      this.statusCode = 500;
    }
  }

  class EmailNotRegisteredError extends UserError {
    constructor(message) {
      super(message || 'Email not registered or not found');
      this.statusCode = 404;
    }
  }

  class InvalidPasswordMatchError extends UserError {
    constructor(message) {
      super(message || 'Password does not match');
      this.statusCode = 400;
    }
  }

  class CifAlreadyInUseError extends UserError {
    constructor(message) {
      super(message || 'CIF already in use');
      this.statusCode = 400;
    }
  }

  class ClientNotFoundError extends UserError {
    constructor(message) {
      super(message || 'Client not found or archived');
      this.statusCode = 404;
    }
  }

  class ProjectNotFoundError extends UserError {
    constructor(message) {
      super(message || 'Project not found or archived');
      this.statusCode = 404;
    }
  }

  class ProjectAlreadyExistsError extends UserError {
    constructor(message) {
      super(message || 'Project already exists');
      this.statusCode = 400;
    }
  }

  class NoteNotFoundError extends UserError {
    constructor(message) {
      super(message || 'Note not found or archived');
      this.statusCode = 404;
    }
  }

  class EntriesNotFoundError extends UserError {
    constructor(message) {
      super(message || 'Entries not found or archived');
      this.statusCode = 404;
    }
  }

  class InvalidNoteFormatError extends UserError {
    constructor(message) {
      super(message || 'Invalid note format');
      this.statusCode = 400;
    }
  }

  class ClientNotArchivedError extends UserError {
    constructor(message) {
      super(message || 'Client not archived');
      this.statusCode = 400;
    }
  }

  class NotAuthorizedError extends UserError {
    constructor(message) {
      super(message || 'Not authorized');
      this.statusCode = 403;
    }
  }

  class ProjectArchivedError extends UserError {
    constructor(message) {
      super(message || 'Project archived');
      this.statusCode = 400;
    }
  }

  class ProjectNotArchivedError extends UserError {
    constructor(message) {
      super(message || 'Project not archived');
      this.statusCode = 400;
    }
  }

  class SignedNoteError extends UserError {
    constructor(message) {
      super(message || 'can not delete a signed note');
      this.statusCode = 400;
    }
  }

  module.exports = {
    UserError,
    UserDisabledError,
    InvalidCredentialsError,
    UserNotFoundError,
    EmailAlreadyInUseError,
    InvalidPasswordError,
    InvalidEmailError,
    InvalidNameError,
    InvalidEmailValidationError,
    EmailAlreadyValidatedError,
    InvalidRouteCompanyError,
    InvalidRouteUserError,
    InvalidJWTError,
    MissingJWTError,
    InvalidEmailSendingError,
    InvalidRecoveryCodeError,
    InvalidEmailCodeError,
    InvalidDatabaseError,
    UserDeactivatedError,
    EmailNotRegisteredError,
    InvalidPasswordMatchError,
    CifAlreadyInUseError,
    ClientNotFoundError,
    ProjectNotFoundError,
    ProjectAlreadyExistsError,
    NoteNotFoundError,
    EntriesNotFoundError,
    InvalidNoteFormatError,
    ClientNotArchivedError,
    NotAuthorizedError,
    ProjectArchivedError,
    ProjectNotArchivedError,
    SignedNoteError,
  };