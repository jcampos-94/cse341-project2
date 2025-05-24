const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// Get all categories
async function getCategories(req, res) {
  try {
    const db = getDB();
    const categories = await db.collection('categories').find().toArray();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a category
async function createCategory(req, res) {
  try {
    const db = getDB();
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Invalid category name' });
    }

    const newCategory = { name: name.trim() };
    const result = await db.collection('categories').insertOne(newCategory);

    res.status(201).json({ message: 'Category created', id: result.insertedId });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update an existing category using Id
async function updateCategory(req, res) {
  try {
    const db = getDB();
    const { name } = req.body;
    const categoryId = req.params.id;

    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Invalid category name' });
    }

    const result = await db
      .collection('categories')
      .updateOne({ _id: new ObjectId(String(categoryId)) }, { $set: { name: name.trim() } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an existing category using Id
async function deleteCategory(req, res) {
  try {
    const db = getDB();
    const categoryId = req.params.id;

    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const result = await db
      .collection('categories')
      .deleteOne({ _id: new ObjectId(String(categoryId)) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
