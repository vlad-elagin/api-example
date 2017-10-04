import request from 'supertest';
import app from './../src/app';

const getUserApiTest = () => {
  // clear db
  beforeAll(async (done) => {
    await app.db.pRun('DELETE FROM users');
    done();
  });

  it('gets empty array from empty database', async () => {
    expect.assertions(3);
    const res = await request(app)
      .get('/api/users');
    expect(res.statusCode).toEqual(200);
    const response = JSON.parse(res.text);
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(0);
  });

  it('gets array of right length and right shape', async () => {
    // create test user
    await request(app)
      .post('/api/register/')
      .send({
        username: 'username',
        password: 'password',
        email: 'test@test.com',
      });
    const res = await request(app)
      .get('/api/users');
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res.text);
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(1);
    expect(response[0].username).toEqual('username');
    expect(response[0].password).toBeUndefined();
    expect(response[0].email).toEqual('test@test.com');
    expect(typeof response[0].id).toBe('string');
  });
};

export default getUserApiTest;
