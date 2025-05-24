const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Task Manager API',
    description: 'API to manage tasks and categories'
  },
  // host: 'localhost:3000',
  // schemes: ['http']
  host: 'render.com site',
  schemes: ['https']
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./server.js', './controllers/taskController.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
