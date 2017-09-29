import sqlite3 from 'sqlite3';
import promisify from 'es6-promisify';

const db = new sqlite3.Database('task_list');
const dbRun = promisify(db.run, db);
const dbGet = promisify(db.get, db);
const dbAll = promisify(db.all, db);

// rewrite to be testable

const prepareTables = async (dbGet, dbRun) => {
  // check existence of 'tasks' table
  try {
    const tasksTable = await dbGet("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'");
    if (!tasksTable) {
      // create table
      dbRun(`
        CREATE TABLE tasks (
          id INTEGER,
          header TEXT,
          description TEXT,
          content TEXT,
          priority TEXT,
          created TEXT,
          creator TEXT,
          isPersonal INTEGER,
          executor TEXT,
          completed INTEGER
        )
      `);
    }
  } catch (err) {
    console.log('error', err); // eslint-disable-line no-console
  }
}

prepareTables(dbGet, dbRun);

export {
  prepareTables,
  dbRun,
  dbGet,
  dbAll
};
export default db;
