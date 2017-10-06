import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const protectedApiRoutesTest = () => {
  let token = null;
  beforeAll(async (done) => {
    ({ token } = await prepareUser());
    done();
  });

  it('Can access unprotected route without token.', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post('/api/login/')
      .send({
        login: 'username',
        password: 'password',
      });
    expect(res.statusCode).toBe(200);
  });

  it('Can\'t access protected route without token.', async () => {
    expect.assertions(1);
    const res = await request(app)
      .get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  it('Can access protected route with token.', async () => {
    expect.assertions(1);
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
};

export default protectedApiRoutesTest;
