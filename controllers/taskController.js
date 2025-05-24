const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const { format } = require('date-fns');

// Get all tasks
async function getTasks(req, res) {
  const db = getDB();
  const tasks = await db.collection('tasks').find().toArray();
  res.json(tasks);
}

// Create a new task
async function createTask(req, res) {
  const db = getDB();

  // Validate that categoryId is a valid ObjectId
  const categoryId = req.body.categoryId;
  if (!ObjectId.isValid(categoryId)) {
    return res.status(400).json({ error: 'Invalid categoryId format' });
  }

  // Check if category actually exists
  const categoryExists = await db
    .collection('categories')
    .findOne({ _id: new ObjectId(String(categoryId)) });

  if (!categoryExists) {
    return res.status(400).json({ error: 'categoryId does not refer to an existing category' });
  }

  // Format dueDate as yyyy-MM-dd or set null
  const parsedDueDate = req.body.dueDate
    ? (() => {
        const [year, month, day] = req.body.dueDate.split('-').map(Number);
        return format(new Date(year, month - 1, day), 'yyyy-MM-dd');
      })()
    : null;

  const task = {
    title: req.body.title,
    description: req.body.description || '',
    dueDate: parsedDueDate,
    priority: req.body.priority || 'medium',
    status: req.body.status || 'pending',
    categoryId: req.body.categoryId,
    createdAt: format(new Date(), 'yyyy-MM-dd')
  };

  try {
    const result = await db.collection('tasks').insertOne(task);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

// Update an existing task using Id
async function updateTask(req, res) {
  const db = getDB();
  const taskId = req.params.id;

  if (!ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  // Fetch existing task
  const existingTask = await db.collection('tasks').findOne({ _id: new ObjectId(String(taskId)) });

  if (!existingTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Build updated task with fallback to original values
  const updatedFields = {
    title: req.body.title ?? existingTask.title,
    description: req.body.description ?? existingTask.description,
    dueDate: req.body.dueDate
      ? (() => {
          const [year, month, day] = req.body.dueDate.split('-').map(Number);
          return format(new Date(year, month - 1, day), 'yyyy-MM-dd');
        })()
      : existingTask.dueDate,
    priority: req.body.priority ?? existingTask.priority,
    status: req.body.status ?? existingTask.status,
    categoryId: req.body.categoryId ?? existingTask.categoryId
  };

  // Validate categoryId if provided
  if (req.body.categoryId && !ObjectId.isValid(req.body.categoryId)) {
    return res.status(400).json({ error: 'Invalid categoryId format' });
  }

  if (req.body.categoryId) {
    const categoryExists = await db
      .collection('categories')
      .findOne({ _id: new ObjectId(String(req.body.categoryId)) });

    if (!categoryExists) {
      return res.status(400).json({ error: 'categoryId does not refer to an existing category' });
    }
  }

  try {
    const result = await db
      .collection('tasks')
      .findOneAndUpdate(
        { _id: new ObjectId(String(taskId)) },
        { $set: updatedFields },
        { returnDocument: 'after' }
      );

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

// Delete an existing task using Id
async function deleteTask(req, res) {
  const db = getDB();
  const result = await db
    .collection('tasks')
    .deleteOne({ _id: new ObjectId(String(req.params.id)) });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
