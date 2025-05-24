const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

async function getTasks(req, res) {
  const db = getDB();
  const tasks = await db.collection('tasks').find().toArray();
  res.json(tasks);
}

async function createTask(req, res) {
  const db = getDB();
  const result = await db.collection('tasks').insertOne(req.body);
  res.status(201).json(result);
}

async function updateTask(req, res) {
  const db = getDB();
  const result = await db
    .collection('tasks')
    .findOneAndUpdate(
      { _id: new ObjectId.toString(req.params.id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );
  if (!result.value) return res.status(404).json({ message: 'Task not found' });
  res.json(result.value);
}

async function deleteTask(req, res) {
  const db = getDB();
  const result = await db
    .collection('tasks')
    .deleteOne({ _id: new ObjectId.toString(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
