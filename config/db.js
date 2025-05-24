const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(); // use default DB from URI
  console.log('MongoDB connected');
};

const getDB = () => db;

module.exports = { connectDB, getDB };
