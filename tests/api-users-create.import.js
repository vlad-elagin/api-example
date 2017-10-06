import request from 'supertest';
import app from './../src/app';

const createUserApiTest = () => {
  it('should create new user', async () => {
    expect.assertions(5);
    const res = await request(app)
      .post('/api/register/')
      .send({
        username: 'username',
        password: 'password',
        email: 'test@test.com',
      });
    const response = JSON.parse(res.text);
    expect(response.username).toEqual('username');
    expect(response.email).toEqual('test@test.com');
    expect(response.password).toBeUndefined();
    expect(typeof response.id).toBe('string');
    expect(res.statusCode).toEqual(200);
  });

  it('should fail if no data sent', async () => {
    expect.assertions(2);
    const res = await request(app)
      .post('/api/register/')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('No data sent.');
  });

  it('should fail when invalid data supplied', async (done) => {
    const validData = {
      username: 'username',
      password: 'password',
      email: 'test@test.com',
    };
    const invalidDataSamples = [
      { username: 'user' },
      { password: 'pass' },
      { email: 'testtest.co' },
    ];
    invalidDataSamples.forEach(async (sample) => {
      const res = await request(app)
        .post('/api/register/')
        .send({ ...validData, ...sample });
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual('Data is invalid, check your validation services.');
    });
    done();
  });

  it('should fail when user exists', async (done) => {
    // new email with old username
    const secondUser = await request(app)
      .post('/api/register/')
      .send({
        username: 'username',
        password: 'password',
        email: 'test1@test.com',
      });
    expect(secondUser.statusCode).toEqual(400);
    expect(secondUser.text).toEqual('Username or email are already taken.');
    // new username with old email
    const thirdUser = await request(app)
      .post('/api/register/')
      .send({
        username: 'username1',
        password: 'password',
        email: 'test@test.com',
      });
    expect(thirdUser.statusCode).toEqual(400);
    expect(thirdUser.text).toEqual('Username or email are already taken.');
    done();
  });
};

export default createUserApiTest;
