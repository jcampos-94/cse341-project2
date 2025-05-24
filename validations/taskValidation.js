const { body, param } = require('express-validator');

const createTaskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['pending', 'in progress', 'done'])
];

const updateTaskValidation = [param('id').isMongoId(), body('title').optional().notEmpty()];

module.exports = { createTaskValidation, updateTaskValidation };
