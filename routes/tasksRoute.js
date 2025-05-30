const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validationHandler = require('../utils/validationHandler');
const { createTaskValidation, updateTaskValidation } = require('../validations/taskValidation');
const { isAuthenticated } = require('../utils/authenticate');

router.get(
  '/',
  // #swagger.tags = ['Tasks']
  // #swagger.description = 'Get all tasks'
  taskController.getTasks
);

router.post(
  '/',
  // #swagger.tags = ['Tasks']
  // #swagger.description = 'Create a new task'
  /* 
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Task info',
    required: true,
    schema: {
      $title: 'Task title',
      description: 'Task description',
      dueDate: '2025-05-23',
      priority: 'high',
      status: 'pending',
      $categoryId: '682fa1f489d7ec710de63759'
    }
  }
  #swagger.responses[201] = { description: 'Task created' }
  #swagger.responses[400] = { description: 'Invalid request' }
  */
  isAuthenticated,
  createTaskValidation,
  validationHandler,
  taskController.createTask
);

router.put(
  '/:id',
  // #swagger.tags = ['Tasks']
  isAuthenticated,
  updateTaskValidation,
  validationHandler,
  taskController.updateTask
);

router.delete(
  '/:id',
  // #swagger.tags = ['Tasks']
  isAuthenticated,
  taskController.deleteTask
);

module.exports = router;
