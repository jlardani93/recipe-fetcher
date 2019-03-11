import mongoose from 'mongoose'
require('dotenv').config({ path: './.env' })
import { populateDatabase } from './backend/db/testUtils'

module.exports = async () => {
  console.log("Initializing setup of test db")
  await mongoose.connect(process.env.TEST_DB_URL, { useNewUrlParser: true });
  const db = mongoose.connection;
  if (db) {
    console.log("Test database was successfully setup")
    global.__MONGOD__ = db;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.on('disconnected', function(){
      console.log("Mongoose default connection is disconnected");
    });
  }
  await populateDatabase()
}