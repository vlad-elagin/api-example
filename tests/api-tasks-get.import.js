import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const getTasksApiTest = () => {
  let token;
  beforeAll(async (done) => {
    token = await prepareUser();
    done();
  });
  /*
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
 */
  // it('Should get ')
};

export default getTasksApiTest;
