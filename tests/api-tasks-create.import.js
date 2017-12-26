import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const createTaskApiTest = () => {
  let token;
  beforeAll(async (done) => {
    ({ token } = await prepareUser());
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
      heading: 'My test task',
      description: 'I need to go for milk',
      priority: 'low',
      isPersonal: true,
      author: 'me',
      completed: false,
    };
    const invalidDataSamples = [
      { heading: '' },
      { description: false },
      { priority: 'wrong priority name' },
      { isPersonal: 'true?' },
      { author: 123 },
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

  it('Should fail if assignee not found', async (done) => {
    const res = await request(app)
      .post('/api/tasks/')
      .send({
        heading: 'My test task',
        description: 'I need to go for milk',
        priority: 'low',
        isPersonal: true,
        assignee: 'me',
        completed: false,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Executor not found.');
    done();
  });

  it('Should create task with no assignee specified', async () => {
    expect.assertions(10);
    const requestData = {
      heading: 'My test task',
      description: 'I need to go for milk',
      priority: 'low',
      isPersonal: true,
      assignee: null,
      completed: false,
    };
    const res = await request(app)
      .post('/api/tasks/')
      .send(requestData)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res.text);
    expect(response.assignee).toBeDefined();
    expect(response.id).toBeDefined();
    expect(response.heading).toEqual(requestData.heading);
    expect(response.description).toEqual(requestData.description);
    expect(response.priority).toEqual(requestData.priority);
    expect(response.created).toBeDefined();
    expect(response.author).toBeDefined();
    expect(typeof response.isPersonal).toBe('boolean');
    expect(typeof response.completed).toBe('boolean');
  });

  it('Should create task with specified assignee', async (done) => {
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
        heading: 'My test task',
        description: 'I need to go for milk',
        priority: 'low',
        isPersonal: true,
        assignee: userId,
        completed: false,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res.text);
    expect(response.assignee).toBeDefined();
    expect(response.assignee).not.toEqual(response.author);
    done();
  });
};

export default createTaskApiTest;
