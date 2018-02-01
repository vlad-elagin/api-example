import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const deleteTaskApiTest = () => {
  let token;
  let task;
  let anotherUsersToken;
  beforeAll(async (done) => {
    // prepare main user before tests
    ({ token } = await prepareUser());
    // prepare another user
    await request(app)
      .post('/api/register/')
      .send({
        username: 'another user',
        password: 'password',
        email: 'testmail@test.com',
      });
    // get another user's token
    const rawLoggedAnotherUser = await request(app)
      .post('/api/login/')
      .send({
        login: 'testmail@test.com',
        password: 'password',
      });
    ({ token: anotherUsersToken } = JSON.parse(rawLoggedAnotherUser.text));
    // prepare fresh task
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

  it('Should fail if no task id specified', async () => {
    expect.assertions(2);
    const res = await request(app)
      .delete('/api/tasks')
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('No task ID sent.');
  });

  it('Should fail if no task found', async () => {
    expect.assertions(2);
    const res = await request(app)
      .delete('/api/tasks')
      .send({ id: '1234-44-1234' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Task not found.');
  });

  it('Should fail if trying to remove other\'s task', async () => {
    expect.assertions(2);
    // create task as another user
    let anotherTask = await request(app)
      .post('/api/tasks/')
      .send({
        heading: 'My test task',
        description: 'I need to go for milk',
        priority: 'low',
        isPersonal: true,
        assignee: null,
        completed: false,
      })
      .set('Authorization', `Bearer ${anotherUsersToken}`);
    anotherTask = JSON.parse(anotherTask.text);
    // remove it
    const res = await request(app)
      .delete('/api/tasks')
      .send({ id: anotherTask.id })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.text).toBe('You can remove only your own tasks.');
  });

  it('Should remove task', async () => {
    expect.assertions(2);
    const res = await request(app)
      .delete('/api/tasks/')
      .send({ id: task.id })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Task removed.');
  });
};

export default deleteTaskApiTest;
