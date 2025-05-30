const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validationHandler = require('../utils/validationHandler');
const {
  createCategoryValidation,
  updateCategoryValidation
} = require('../validations/categoryValidation');
const { isAuthenticated } = require('../utils/authenticate');

router.get(
  '/',
  // #swagger.tags = ['Categories']
  categoryController.getCategories
);

router.post(
  '/',
  // #swagger.tags = ['Categories']
  isAuthenticated,
  createCategoryValidation,
  validationHandler,
  categoryController.createCategory
);

router.put(
  '/:id',
  // #swagger.tags = ['Categories']
  isAuthenticated,
  updateCategoryValidation,
  validationHandler,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  // #swagger.tags = ['Categories']
  isAuthenticated,
  categoryController.deleteCategory
);

module.exports = router;
