const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validationHandler = require('../utils/validationHandler');
const { createTaskValidation, updateTaskValidation } = require('../validations/taskValidation');

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
  createTaskValidation,
  validationHandler,
  taskController.createTask
);

router.put(
  '/:id',
  // #swagger.tags = ['Tasks']
  updateTaskValidation,
  validationHandler,
  taskController.updateTask
);

router.delete(
  '/:id',
  // #swagger.tags = ['Tasks']
  taskController.deleteTask
);

module.exports = router;
