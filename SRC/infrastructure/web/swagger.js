const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Final project API',
      version: '1.0.0',
      description: 'Develop an API using NodeJS and Express to manage delivery notes (hours worked or materials used) between clients and providers. The API should allow the following operations through its endpoints',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Dev server'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      responses: {
        UserDisabledError: {
          description: "Account is deactivated or deleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Account is deactivated or deleted(soft delete)" }
                }
              }
            }
          }
        },
        UserDeactivatedError: {
          description: "Account is deactivated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Account is deactivated" }
                }
              }
            }
          }
        },
        InvalidCredentialsError: {
          description: "Invalid credentials",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid credentials" }
                }
              }
            }
          }
        },
        UserNotFoundError: {
          description: "User not found in the database",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Not found" }
                }
              }
            }
          }
        },
        InvalidPasswordError: {
          description: "Password must be at least 8 characters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid password, must be at least 8 characters" }
                }
              }
            }
          }
        },
        InvalidEmailError: {
          description: "Email format is not valid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid email, must be a valid email address" }
                }
              }
            }
          }
        },
        EmailAlreadyInUseError: {
          description: "Email already registered",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Email already in use" }
                }
              }
            }
          }
        },
        InvalidNameError: {
          description: "Invalid name, must be at least 3 characters long",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid name, must be at least 3 characters long" }
                }
              }
            }
          }
        },
        InvalidEmailValidationError: {
          description: "Email not validated or JWT is old",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Email not validated, please validate your email before logging in or JWT is old" }
                }
              }
            }
          }
        },
        EmailAlreadyValidatedError: {
          description: "Email already validated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Email already validated" }
                }
              }
            }
          }
        },
        InvalidRouteCompanyError: {
          description: "Route not allowed for company account",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid route, your account is a company" }
                }
              }
            }
          }
        },
        InvalidRouteUserError: {
          description: "Route not allowed for user account",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid route, your account is a user" }
                }
              }
            }
          }
        },
        InvalidJWTError: {
          description: "Invalid JWT",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid JWT" }
                }
              }
            }
          }
        },
        MissingJWTError: {
          description: "Missing JWT",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Missing JWT" }
                }
              }
            }
          }
        },
        InvalidEmailSendingError: {
          description: "Email sending failed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "An error occurred during sending email, user creation rolled back." }
                }
              }
            }
          }
        },
        InvalidRecoveryCodeError: {
          description: "Invalid recovery code",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid recovery code" }
                }
              }
            }
          }
        },
        InvalidEmailCodeError: {
          description: "Invalid email code",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid email code" }
                }
              }
            }
          }
        },
        InvalidDatabaseError: {
          description: "Database error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Database error, table not found or an error occurred while creating the table" }
                }
              }
            }
          }
        },
        EmailNotRegisteredError: {
          description: "Email not registered",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Email not registered or not found" }
                }
              }
            }
          }
        },
        InvalidPasswordMatchError: {
          description: "Passwords do not match",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Password does not match" }
                }
              }
            }
          }
        },
        CifAlreadyInUseError: {
          description: "CIF already in use",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "CIF already in use" }
                }
              }
            }
          }
        },
        ClientNotFoundError: {
          description: "Client not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Client not found or archived" }
                }
              }
            }
          }
        },
        ProjectNotFoundError: {
          description: "Project not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Project not found or archived" }
                }
              }
            }
          }
        },
        ProjectAlreadyExistsError: {
          description: "Project already exists",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Project already exists" }
                }
              }
            }
          }
        },
        NoteNotFoundError: {
          description: "Note not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Note not found or archived" }
                }
              }
            }
          }
        },
        EntriesNotFoundError: {
          description: "Entries not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Entries not found or archived" }
                }
              }
            }
          }
        },
        InvalidNoteFormatError: {
          description: "Invalid note format",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid note format" }
                }
              }
            }
          }
        },
        ClientNotArchivedError: {
          description: "Client not archived",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Client not archived" }
                }
              }
            }
          }
        },
        NotAuthorizedError: {
          description: "Not authorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Not authorized" }
                }
              }
            }
          }
        },
        ProjectArchivedError: {
          description: "Project archived",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Project archived" }
                }
              }
            }
          }
        },
        ProjectNotArchivedError: {
          description: "Project not archived",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Project not archived" }
                }
              }
            }
          }
        },
        SignedNoteError: {
          description: "Cannot delete a signed note",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "can not delete a signed note" }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [__dirname +'/express/routes/*.js'], // Percorso ai tuoi router
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;