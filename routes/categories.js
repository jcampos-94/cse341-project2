const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {
  createCategoryValidation,
  updateCategoryValidation
} = require('../validations/categoryValidation');
const { validationResult } = require('express-validator');

router.get(
  '/',
  // #swagger.tags = ['Categories']
  categoryController.getCategories
);

router.post(
  '/',
  // #swagger.tags = ['Categories']
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
  // #swagger.tags = ['Categories']
  updateCategoryValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  categoryController.updateCategory
);

router.delete(
  '/:id',
  // #swagger.tags = ['Categories']
  categoryController.deleteCategory
);

module.exports = router;
