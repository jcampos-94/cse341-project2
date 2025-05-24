const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validationHandler = require('../utils/validationHandler');
const {
  createCategoryValidation,
  updateCategoryValidation
} = require('../validations/categoryValidation');

router.get(
  '/',
  // #swagger.tags = ['Categories']
  categoryController.getCategories
);

router.post(
  '/',
  // #swagger.tags = ['Categories']
  createCategoryValidation,
  validationHandler,
  categoryController.createCategory
);

router.put(
  '/:id',
  // #swagger.tags = ['Categories']
  updateCategoryValidation,
  validationHandler,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  // #swagger.tags = ['Categories']
  categoryController.deleteCategory
);

module.exports = router;
