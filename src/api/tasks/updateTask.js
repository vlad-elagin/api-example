import { typeCheck } from 'type-check';
import requestTypes from './../../helpers/requestTypes';
import app from './../../app';

const updateTask = (req, res) => {
  // check request data
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send('No data sent.');
    return;
  }
  
  console.log('UPDATING TASK'); // eslint-disable-line no-console
  res.sendStatus(200);
};

export default updateTask;
