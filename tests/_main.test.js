// setup test suite
import app from '../src/app';

// db configuration
import prepareDatabaseTest from './db.import';

// users crud api
import createUserApiTest from './api-users-create.import';
import getUserApiTest from './api-users-get.import';

// auth api
import loginApiTest from './api-auth-login.import';


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
  });

  // run those last as they close db connection
  // fails sometimes, dont know why, disable in this case
  describe('Database initial configuration', prepareDatabaseTest);
});
