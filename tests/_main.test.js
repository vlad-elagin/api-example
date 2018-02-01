// setup test suite
import request from 'supertest';
import app from '../src/app';

// db configuration
import prepareDatabaseTest from './db.import';

// users api
import createUserApiTest from './api-users-create.import';
import getUserApiTest from './api-users-get.import';

// auth api
import loginApiTest from './api-auth-login.import';
import protectedApiRoutesTest from './api-protected-routes.import';

// tasks api
import getTasksApiTest from './api-tasks-get.import';
import createTaskApiTest from './api-tasks-create.import';
import updateTaskApiTest from './api-tasks-update.import';
import deleteTaskApiTest from './api-tasks-delete.import';

// receiving token for protected routes
const prepareUser = async () => {
  // clear db
  await app.db.pRun('DELETE FROM users');
  // create test user
  await request(app)
    .post('/api/register/')
    .send({
      username: 'username',
      password: 'password',
      email: 'test@test.com',
    });
  // get auth token
  const res = await request(app)
    .post('/api/login/')
    .send({
      login: 'username',
      password: 'password',
    });
  return JSON.parse(res.text);
};

/* ===================================================
    TESTS
==================================================== */

describe('API tests', () => {
  beforeAll((done) => {
    app.on('database_ready', () => {
      done();
    });
  });

  describe('Users API', () => {
    describe('User creation', createUserApiTest);
    describe('Users fetching', getUserApiTest);
  });

  describe('Auth API', () => {
    describe('User login', loginApiTest);
    describe('Protected routes', protectedApiRoutesTest);
  });

  describe('Tasks API', () => {
    beforeEach(async () => {
      await app.db.pRun('DELETE FROM tasks');
    });
    describe('Task creating', createTaskApiTest);
    describe('Tasks fetching', getTasksApiTest);
    describe('Task updating', updateTaskApiTest);
    describe('Task deleting', deleteTaskApiTest);
  });

  // run those last as they close db connection
  // will fail if some of previous tests failed, disable in this case
  // describe('Database initial configuration', prepareDatabaseTest);
});

export default prepareUser;
