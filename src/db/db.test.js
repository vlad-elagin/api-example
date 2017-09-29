import sqlite3 from 'sqlite3';
import promisify from 'es6-promisify';
import { prepareTables } from './db';

const db = new sqlite3.Database(':memory:');
const dbRun = promisify(db.run, db);
const dbGet = promisify(db.get, db);
const dbAll = promisify(db.all, db);

const tasksSchema = {
  id: 'INTEGER',
  header: 'TEXT',
  description: 'TEXT',
  content: 'TEXT',
  priority: 'TEXT',
  created: 'TEXT',
  creator: 'TEXT',
  isPersonal: 'INTEGER',
  executor: 'TEXT',
  completed: 'INTEGER'
};

describe('Preparing DB tables at first run', () => {
  // drop table before each test
  beforeEach(async () => {
    await dbRun('DROP TABLE IF EXISTS tasks');
  })

  it('should create "tasks" table with proper schema', async () => {
    expect.assertions(3);
    let table = await dbGet("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'");
    expect(table).toBeUndefined();
    await prepareTables(dbGet, dbRun);
    table = await dbGet("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'");
    expect(table).toEqual({ name: 'tasks' });
    const rawSchema = await dbAll('PRAGMA table_info("tasks")');
    const schema = Object.assign(...rawSchema.map((column) => {
      return { [column.name]: column.type }
    }));
    expect(schema).toEqual(tasksSchema);
  });
});
