import sqlite3 from 'sqlite3';
import promisify from 'es6-promisify';

const db = new sqlite3.Database('task_list');
const dbRun = promisify(db.run);
const dbGet = promisify(db.get);

const prepareTables = async (db) => {
  // check existence of 'tasks' table
  const tasksTable = await dbGet("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'");
  console.log(tasksTable);
  /*
  , (err, res) => {
    console.log('checking existence of tasks table', err, res);
    if (!err && !res) {
      // create table
      db.run(`
        CREATE TABLE tasks (
          id INTEGER,
          header TEXT,
          description TEXT,
          content TEXT,
          priority TEXT,
          created TEXT,
          creator TEXT,
          isPublic INTEGER,
          executor TEXT,
          completed INTEGER
        )
      `, (err, res) => {
        console.log('creation of table tasks', err, res);
      })
    }
  });*/
}

prepareTables(db);

export {
  prepareTables,
  dbRun,
  dbGet
};
export default db;
