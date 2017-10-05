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

// preparing test user function to use in 'beforeAll' for protected routes
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
  const { token } = JSON.parse(res.text);
  return token;
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
    describe('User creation API', createUserApiTest);
    describe('Users fetching API', getUserApiTest);
  });

  describe('Auth API', () => {
    describe('User login', loginApiTest);
    describe('Protected routes', protectedApiRoutesTest);
  });

  // run those last as they close db connection
  // fails sometimes, dont know why, disable in this case
  describe('Database initial configuration', prepareDatabaseTest);
});

export default prepareUser;
