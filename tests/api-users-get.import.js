import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const getUserApiTest = () => {
  // clear db
  let token;
  beforeAll(async (done) => {
    token = await prepareUser();
    done();
  });

  it('gets array of right length and right shape', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
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
