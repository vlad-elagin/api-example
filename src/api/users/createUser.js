import { typeCheck } from 'type-check';
import * as uuid from 'uuid';
import bcrypt from 'bcrypt-nodejs';
import requestTypes from '@helpers/requestTypes';
import app from '@root/app';

const createUser = async (req, res) => {
  // check request data
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send('No data sent.');
    return;
  }
  // type checking
  const isValidRequest = typeCheck(`{
    username: Username,
    password: Password,
    email: Email
  }`, req.body, { customTypes: { ...requestTypes } });
  if (!isValidRequest) {
    res.status(400).send('Data is invalid, check your validation services.');
    return;
  }
  // check username and email existence
  try {
    const user = await app.db.pGet(`
      SELECT id FROM users
      WHERE username="${req.body.username}" OR email="${req.body.email}"`);
    if (user) {
      res.status(400).send('Username or email are already taken.');
      return;
    }
  } catch (err) {
    res.status(500).send('Unlucky, database error.');
    return;
  }
  // create user
  try {
    const newUser = {
      id: uuid.v4(),
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    };
    await app.db.pRun(`
      INSERT INTO users (id, username, email, password)
      VALUES (
        "${newUser.id}",
        "${newUser.username}",
        "${newUser.email}",
        "${newUser.password}"
      )
    `);
    const response = await app.db.pGet(`SELECT * FROM users WHERE id='${newUser.id}'`);
    delete response.password;
    res.status(200).send(response);
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
    res.status(500).send('Unlucky, database error.');
  }
};

export default createUser;
