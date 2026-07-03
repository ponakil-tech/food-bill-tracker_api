const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'food-bill-tracker API',
      version: '1.0.0',
      description: 'API to track food bills/expenses',
    },
    servers: [{ url: '/' }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
