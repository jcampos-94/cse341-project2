const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {
  createCategoryValidation,
  updateCategoryValidation
} = require('../validations/categoryValidation');
const { validationResult } = require('express-validator');

// #swagger.tags = ['Categories']
router.get('/', categoryController.getCategories);

router.post(
  '/',
  createCategoryValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  categoryController.createCategory
);

router.put(
  '/:id',
  updateCategoryValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  categoryController.updateCategory
);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
