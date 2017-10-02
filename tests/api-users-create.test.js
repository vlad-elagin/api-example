import request from 'supertest';

import app from './../src/app';

describe('createUser API method', () => {
  it('should create new user', async (done) => {
    const res = await request(app)
      .post('/api/users/')
      .send({
        username: 'username',
        password: 'password',
        email: 'test@test.com',
      });
    // console.log(res.statusCode, res.text);
    expect(res.body.name).toEqual('username');
    expect(res.body.email).toEqual('test@test.com');
    expect(res.body.password).tobeUndefined();
    expect(res.body.id).toBeInstanceOf(String);
    expect(res.statusCode).toEqual(200);
    done();
  });
});
