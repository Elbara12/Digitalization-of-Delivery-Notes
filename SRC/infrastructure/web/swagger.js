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
        url: 'http://localhost:3000/api',
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
      }
    },
  },
  apis: [__dirname +'/express/routes/*.js'], // Percorso ai tuoi router
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;