import { prepareTables, connectToDatabase } from './../src/db/db';

const tasksSchema = {
  id: 'TEXT',
  heading: 'TEXT',
  description: 'TEXT',
  priority: 'TEXT',
  created: 'TEXT',
  author: 'TEXT',
  isPersonal: 'INTEGER',
  assignee: 'TEXT',
  completed: 'INTEGER',
};

const usersSchema = {
  id: 'TEXT',
  username: 'TEXT',
  email: 'TEXT',
  password: 'TEXT',
};

const prepareDatabaseTest = () => {
  // create brand new DB connection to test prepareTables function
  let db = null;
  beforeEach(() => {
    db = connectToDatabase();
  });
  afterEach(async (done) => {
    await db.pClose();
    db = null;
    done();
  });

  it('should create "tasks" table with proper schema', async () => {
    // expect.assertions(3);
    let table = await db.pGet("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'");
    expect(table).toBeUndefined();
    await prepareTables(db);
    table = await db.pGet("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'");
    expect(table).toEqual({ name: 'tasks' });
    const rawSchema = await db.pAll('PRAGMA table_info("tasks")');
    const schema = Object.assign(...rawSchema.map(column => ({ [column.name]: column.type })));
    expect(schema).toEqual(tasksSchema);
  });

  it('should create "users" table with proper schema', async () => {
    expect.assertions(3);
    let table = await db.pGet("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    expect(table).toBeUndefined();
    await prepareTables(db);
    table = await db.pGet("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    expect(table).toEqual({ name: 'users' });
    const rawSchema = await db.pAll('PRAGMA table_info("users")');
    const schema = Object.assign(...rawSchema.map(column => ({ [column.name]: column.type })));
    expect(schema).toEqual(usersSchema);
  });
};

export default prepareDatabaseTest;
