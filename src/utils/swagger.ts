import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Risk Engine API',
    version: '1.0.0',
    description: 'API documentation for the Risk Engine',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

export default swaggerJSDoc(options); 