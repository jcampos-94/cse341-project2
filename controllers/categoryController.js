const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

async function getCategories(req, res) {
  const db = getDB();
  const categories = await db.collection('categories').find().toArray();
  res.json(categories);
}

async function createCategory(req, res) {
  const db = getDB();
  const { name } = req.body;

  const newCategory = { name };
  const result = await db.collection('categories').insertOne(newCategory);

  res.status(201).json({ message: 'Category created', id: result.insertedId });
}

async function updateCategory(req, res) {
  const db = getDB();
  const { name } = req.body;

  const result = await db
    .collection('categories')
    .updateOne({ _id: new ObjectId.toString(req.params.id) }, { $set: { name } });

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json({ message: 'Category updated' });
}

async function deleteCategory(req, res) {
  const db = getDB();

  const result = await db.collection('categories').deleteOne({ _id: new ObjectId(req.params.id) });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json({ message: 'Category deleted' });
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
