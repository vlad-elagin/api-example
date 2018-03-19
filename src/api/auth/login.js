import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import app from '@root/app';
import { jwtSecret } from '@config/auth';

const loginUser = async (req, res) => {
  // check request data
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send('No credentials supplied.');
    return;
  }
  // find user
  let user;
  try {
    user = await app.db.pGet(`
      SELECT * FROM users
      WHERE username="${req.body.login}"
      OR email="${req.body.login}"
    `);
    if (!user) {
      res.status(400).send('Invalid login or password.');
      return;
    }
  } catch (err) {
    res.status(500).send('Unlucky, database error.');
    return;
  }
  // check for passwords matching
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    // password incorrect
    res.status(400).send('Invalid login or password.');
    return;
  }
  // password is correct, generate and send token
  delete user.password;
  const response = {
    user,
    token: jwt.sign({
      userId: user.id,
    }, jwtSecret, { expiresIn: '10h' }),
  };
  res.status(200).send(response);
};

export default loginUser;
