import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const createTaskApiTest = () => {
  let token;
  beforeAll(async (done) => {
    token = await prepareUser();
    done();
  });

  it('Should fail if no data sent.', async () => {
    expect.assertions(2);
    const res = await request(app)
      .post('/api/tasks/')
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('No data sent.');
  });

  it('Should fail when invalid data supplied', async (done) => {
    // check every request field
    const validData = {
      header: 'My test task',
      description: '',
      content: 'I need to go for milk',
      priority: 'low',
      isPersonal: true,
      executor: 'me',
      completed: false,
    };
    const invalidDataSamples = [
      { header: '' },
      { description: false },
      { content: '' },
      { priority: 'wrong priority name' },
      { isPersonal: 'true?' },
      { executor: 123 },
      { completed: 'false?' },
    ];
    invalidDataSamples.forEach(async (sample) => {
      const res = await request(app)
        .post('/api/tasks/')
        .send({ ...validData, ...sample })
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Data is invalid, check your validation services.');
    });
    done();
  });

  it('Should fail if executor not found', async (done) => {
    const res = await request(app)
      .post('/api/tasks/')
      .send({
        header: 'My test task',
        description: '',
        content: 'I need to go for milk',
        priority: 'low',
        isPersonal: true,
        executor: 'me',
        completed: false,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Executor not found.');
    done();
  });

  it('Should create task with no executor specified', async () => {
    expect.assertions(12);
    const requestData = {
      header: 'My test task',
      description: '',
      content: 'I need to go for milk',
      priority: 'low',
      isPersonal: true,
      executor: null,
      completed: false,
    };
    const res = await request(app)
      .post('/api/tasks/')
      .send(requestData)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res.text);
    expect(response.executor).toBeDefined();
    expect(response.id).toBeDefined();
    expect(response.header).toEqual(requestData.header);
    expect(response.description).toEqual(requestData.description);
    expect(response.content).toEqual(requestData.content);
    expect(response.priority).toEqual(requestData.priority);
    expect(response.created).toBeDefined();
    expect(response.creator).toBeDefined();
    expect(typeof response.isPersonal).toBe('boolean');
    expect(typeof response.completed).toBe('boolean');
    expect(response.executor).toBeDefined();
  });

  it('Should create task with specified executor', async (done) => {
    // create another user to be assigned for task
    const user = await request(app)
      .post('/api/register/')
      .send({
        username: 'another user',
        password: 'password',
        email: 'testmail@test.com',
      });
    const { id: userId } = JSON.parse(user.text);
    // create task for this user
    const res = await request(app)
      .post('/api/tasks/')
      .send({
        header: 'My test task',
        description: '',
        content: 'I need to go for milk',
        priority: 'low',
        isPersonal: true,
        executor: userId,
        completed: false,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res.text);
    expect(response.executor).toBeDefined();
    expect(response.executor).not.toEqual(response.creator);
    done();
  });
};

export default createTaskApiTest;
