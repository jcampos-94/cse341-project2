const { body, param } = require('express-validator');
const { ObjectId } = require('mongodb');

// Validation for creating a task
const createTaskValidation = [
  body('title').notEmpty().withMessage('Title is required'),

  body('description')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty if provided'),

  body('dueDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Due date must be in yyyy-mm-dd format')
    .custom((date) => {
      const parsed = Date.parse(date);
      if (isNaN(parsed)) throw new Error('Invalid date');
      return true;
    }),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('status')
    .optional()
    .isIn(['pending', 'in progress', 'done'])
    .withMessage('Status must be one of: pending, in progress, done'),

  body('categoryId')
    .notEmpty()
    .withMessage('categoryId is required')
    .custom((value) => {
      if (!ObjectId.isValid(value)) {
        throw new Error('Invalid categoryId format');
      }
      return true;
    })
];

// Validation for updating a task
const updateTaskValidation = [
  param('id').isMongoId().withMessage('Invalid task ID'),

  body('title').optional().notEmpty().withMessage('Title cannot be empty'),

  body('description')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty if provided'),

  body('dueDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Due date must be in yyyy-mm-dd format')
    .custom((date) => {
      const parsed = Date.parse(date);
      if (isNaN(parsed)) throw new Error('Invalid date');
      return true;
    }),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('status')
    .optional()
    .isIn(['pending', 'in progress', 'done'])
    .withMessage('Status must be one of: pending, in progress, done'),

  body('categoryId')
    .optional()
    .custom((value) => {
      if (!ObjectId.isValid(value)) {
        throw new Error('Invalid categoryId format');
      }
      return true;
    })
];

module.exports = { createTaskValidation, updateTaskValidation };
