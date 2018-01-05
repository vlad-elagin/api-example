import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const updateTaskApiTest = () => {
  let token;
  beforeAll(async (done) => {
    ({ token } = await prepareUser());
    done();
  });
  // prepare fresh task before each test
  let task;
  beforeEach(async (done) => {

  });

  // look at that retarded idiot who's using POST and stupidly grinning when tests are passed
  // dont forget to pass tasks id and write test for case when id is invalid

  it('Should fail if no data sent.', async () => {
    expect.assertions(2);
    const res = await request(app)
      .post('/api/tasks/')
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('No data sent.');
  });

  it('Should fail if invalid data supplied', async (done) => {
    // create another user to be assigned for task
    const user = await request(app)
      .post('/api/register/')
      .send({
        username: 'another user',
        password: 'password',
        email: 'testmail@test.com',
      });
    const { id: userId } = JSON.parse(user.text);
    const validData = {
      heading: 'New tested heading',
      description: 'New tested description',
      priority: 'high',
      isPersonal: true,
      assignee: userId,
      completed: true,
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
        .patch('/api/tasks/')
        .send({ ...validData, ...sample })
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Data is invalid, check your validation services.');
    });
    done();
  });

  it('Should fail if assignee not found', async (done) => {
    const res = await request(app)
      .patch('/api/tasks/')
      .send({
        assignee: 'me',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Executor not found.');
    done();
  });

  // user can update only heading, description, priority, personality, author and completed fields
  it('Shouldn\'t update protected task fields', async () => {

  });
};

export default updateTaskApiTest;
