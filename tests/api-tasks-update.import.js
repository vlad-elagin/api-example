import request from 'supertest';
import app from './../src/app';
import prepareUser from './_main.test';

const updateTaskApiTest = () => {
  let token;
  beforeAll(async (done) => {
    ({ token } = await prepareUser());
    done();
  });

  it('Should fail if no data sent.', async () => {
    expect.assertions(2);
    const res = await request(app)
      .put('/api/tasks/')
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('No data sent.');
  });

  it('Should fail if invalid data supplied', async (done) => {
    /*
    const validData = {
      header:
    }
    */
  });
};

export default updateTaskApiTest;
