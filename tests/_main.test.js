// setup test suite
import app from '../src/app';

// db configuration
// import prepareDatabaseTest from './db.import';

// users crud api
import createUserApiTest from './api-users-create.import';


describe('API tests', () => {
  beforeAll((done) => {
    app.on('database_ready', () => {
      done();
    });
  });

  describe('Users API', () => {
    describe('User creation API', createUserApiTest);
  });

  // run those last as they close db connection
  // describe('Database initial configuration', prepareDatabaseTest);
});
