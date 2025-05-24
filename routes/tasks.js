const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { createTaskValidation, updateTaskValidation } = require('../validations/taskValidation');
const { validationResult } = require('express-validator');

// #swagger.tags = ['Tasks']
router.get('/', taskController.getTasks);

router.post(
  '/',
  createTaskValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  taskController.createTask
);

router.put(
  '/:id',
  updateTaskValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  taskController.updateTask
);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
