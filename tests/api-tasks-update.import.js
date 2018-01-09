import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const updateTaskApiTest = () => {
  let token;
  let anotherUser;
  let anotherUsersToken;
  beforeAll(async (done) => {
    // prepare main user before tests
    ({ token } = await prepareUser());
    // prepare another user
    const user = await request(app)
      .post('/api/register/')
      .send({
        username: 'another user',
        password: 'password',
        email: 'testmail@test.com',
      });
    anotherUser = JSON.parse(user.text);
    // get another user's token
    const rawLoggedAnotherUser = await request(app)
      .post('/api/login/')
      .send({
        login: 'testmail@test.com',
        password: 'password',
      });
    ({ token: anotherUsersToken } = JSON.parse(rawLoggedAnotherUser.text));
    done();
  });
  // prepare fresh task before each test
  let task;
  beforeEach(async (done) => {
    await app.db.pRun('DELETE FROM tasks');
    const res = await request(app)
      .post('/api/tasks/')
      .send({
        heading: 'New test heading',
        description: 'New test description',
        priority: 'high',
        isPersonal: true,
        assignee: null,
        completed: true,
      })
      .set('Authorization', `Bearer ${token}`);
    task = JSON.parse(res.text);
    done();
  });

  it('Should fail if no data sent.', async () => {
    expect.assertions(2);
    const res = await request(app)
      .patch('/api/tasks/')
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('No data sent.');
  });

  it('Should fail if no or wrong task ID sent', async () => {
    const res = await request(app)
      .patch('/api/tasks/')
      .send({
        heading: 'Another test heading',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Wrong task ID.');
  });

  it('Should fail if trying to modify task of another user.', async (done) => {
    const res = await request(app)
      .patch('/api/tasks/')
      .send({
        id: task.id,
        heading: 'Another test heading',
      })
      .set('Authorization', `Bearer ${anotherUsersToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.text).toBe('You are not permitted to change this task.');
    done();
  });

  it('Should fail if assignee not found', async (done) => {
    const res = await request(app)
      .patch('/api/tasks/')
      .send({
        id: task.id,
        assignee: null,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Assignee not found.');
    done();
  });

  it('Should fail when invalid data supplied', (done) => {
    const validData = {
      id: task.id,
      heading: 'New tested heading',
      description: 'New tested description',
      priority: 'high',
      isPersonal: true,
      assignee: anotherUser.id,
      completed: true,
    };
    const invalidDataSamples = [
      { heading: '' },
      { description: false },
      { priority: 'wrong priority name' },
      { isPersonal: 'true?' },
      { completed: 'false?' },
    ];
    const promises = invalidDataSamples.map(async sample =>
      request(app)
        .patch('/api/tasks/')
        .send({ ...validData, ...sample })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.text).toBe('Data is invalid, check your validation services.');
        }));
    Promise.all(promises).then(() => { done(); });
  });

  it('Should update task', async () => {
    expect.assertions(8);
    const res = await request(app)
      .patch('/api/tasks/')
      .send({
        id: task.id,
        heading: 'Updated heading',
        description: 'Updated description',
        priority: 'low',
        isPersonal: false,
        assignee: anotherUser.id,
        completed: false,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const updatedTask = JSON.parse(res.text);
    expect(updatedTask.heading).toEqual('Updated heading');
    expect(updatedTask.description).toEqual('Updated description');
    expect(updatedTask.priority).toEqual('low');
    expect(updatedTask.isPersonal).toBe(false);
    expect(updatedTask.assignee).not.toBe(updatedTask.author);
    expect(updatedTask.assignee).toEqual(anotherUser.id);
    expect(updatedTask.completed).toBe(false);
  });
};

export default updateTaskApiTest;
