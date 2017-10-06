import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const getTasksApiTest = () => {
  let token;
  let user;
  const stubTask = {
    header: 'My public task',
    description: '',
    content: 'I need to go for milk',
    priority: 'low',
    isPersonal: false,
    executor: null,
    completed: false,
  };
  beforeAll(async (done) => {
    ({ token, user } = await prepareUser());
    done();
  });
  it('Should get empty array if no tasks present', async () => {
    expect.assertions(3);
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res.text);
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(0);
  });

  it('Should get tasks of logged users (including personal ones)', async () => {
    expect.assertions(3);
    // create 2 tasks for logged user
    await request(app)
      .post('/api/tasks/')
      .send(stubTask)
      .set('Authorization', `Bearer ${token}`);
    await request(app)
      .post('/api/tasks/')
      .send({ ...stubTask, isPersonal: true })
      .set('Authorization', `Bearer ${token}`);
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res.text);
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(2);
  });

  it('Should fail if wrong user id specified', async () => {
    expect.assertions(2);
    const res = await request(app)
      .get('/api/tasks/?user_id=wrong-user-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('User not found.');
  });

  it('Should get tasks of another user (without personal ones)', async () => {
    expect.assertions(5);
    // create another user and get token
    await request(app)
      .post('/api/register/')
      .send({
        username: 'username1',
        password: 'password',
        email: 'test1@test.com',
      });
    const newUserResponse = await request(app)
      .post('/api/login/')
      .send({
        login: 'username1',
        password: 'password',
      });
    const { token: newUserToken, user: newUser } = JSON.parse(newUserResponse.text);
    // create personal task and check that 0 is returned
    await request(app)
      .post('/api/tasks/')
      .send({ ...stubTask, isPersonal: true })
      .set('Authorization', `Bearer ${newUserToken}`);
    const res = await request(app)
      .get(`/api/tasks/?user_id=${newUser.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Specified user doesn\'t have public tasks.');
    // create public task and check that it is returned
    await request(app)
      .post('/api/tasks/')
      .send(stubTask)
      .set('Authorization', `Bearer ${newUserToken}`);
    // get his tasks
    const res1 = await request(app)
      .get(`/api/tasks?user_id=${newUser.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res1.statusCode).toBe(200);
    const response1 = JSON.parse(res1.text);
    expect(Array.isArray(response1)).toBe(true);
    expect(response1.length).toBe(1);
  });
};

export default getTasksApiTest;
