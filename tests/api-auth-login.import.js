import request from 'supertest';
import app from './../src/app';

const loginApiTest = () => {
  beforeAll(async (done) => {
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
    done();
  });

  it('Errors when no data supplied', async () => {
    expect.assertions(2);
    const res = await request(app)
      .post('/api/login/')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('No credentials supplied.');
  });

  // for following two tests errors will be the same
  it('Errors when invalid login supplied', async () => {
    expect.assertions(2);
    const res = await request(app)
      .post('/api/login/')
      .send({
        login: 'username1',
        password: 'password',
      });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Invalid login or password.');
  });

  it('Errors when invalid password supplied', async () => {
    expect.assertions(2);
    const res = await request(app)
      .post('/api/login/')
      .send({
        login: 'username',
        password: 'password1',
      });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Invalid login or password.');
  });

  it('Can log in with username as login', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post('/api/login/')
      .send({
        login: 'username',
        password: 'password',
      });
    expect(res.statusCode).toBe(200);
  });

  it('Can log in with email as login', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post('/api/login/')
      .send({
        login: 'test@test.com',
        password: 'password',
      });
    expect(res.statusCode).toBe(200);
  });

  it('Gets token and user object after login', async () => {
    expect.assertions(6);
    const res = await request(app)
      .post('/api/login/')
      .send({
        login: 'username',
        password: 'password',
      });
    const response = JSON.parse(res.text);
    expect(typeof response).toBe('object');
    expect(typeof response.token).toBe('string');
    expect(response.user.username).toEqual('username');
    expect(response.user.password).toBeUndefined();
    expect(response.user.email).toEqual('test@test.com');
    expect(typeof response.user.id).toBe('string');
  });
};

export default loginApiTest;
