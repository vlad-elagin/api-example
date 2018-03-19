import sqlite3 from 'sqlite3';
import promisify from 'es6-promisify';
import app from '@root/app';

const connectToDatabase = () => {
  let db;
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    db = new sqlite3.Database('task_list');
  } else if (process.env.NODE_ENV === 'test') {
    db = new sqlite3.Database(':memory:');
  } else {
    throw new Error('Environment is not defined!');
  }
  db.pRun = promisify(db.run, db);
  db.pGet = promisify(db.get, db);
  db.pAll = promisify(db.all, db);
  db.pClose = promisify(db.close, db);
  return db;
};

const prepareTables = async (db) => {
  // check existence of 'tasks' table
  try {
    const tasksTable = await db.pGet("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'");
    if (!tasksTable) {
      // create table
      db.pRun(`
        CREATE TABLE tasks (
          id TEXT,
          heading TEXT,
          description TEXT,
          priority TEXT,
          created TEXT,
          author TEXT,
          isPersonal INTEGER,
          assignee TEXT,
          completed INTEGER
        )
      `);
    }
  } catch (err) {
    console.log('error', err); // eslint-disable-line no-console
  }

  // check existence of 'users' table
  try {
    const usersTable = await db.pGet("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    if (!usersTable) {
      // create table
      db.pRun(`
        CREATE TABLE users (
          id TEXT,
          username TEXT,
          email TEXT,
          password TEXT
        )
      `);
    }
  } catch (err) {
    console.log('error', err); // eslint-disable-line no-console
  }

  app.db = db;
  app.emit('database_ready');
};

// create working connection for server
const db = connectToDatabase();
prepareTables(db);

// export those functions for testing
export { prepareTables, connectToDatabase };

export default db;
