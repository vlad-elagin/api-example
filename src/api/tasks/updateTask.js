import { typeCheck } from 'type-check';
import requestTypes from './../../helpers/requestTypes';
import app from './../../app';

const updateTask = async (req, res) => {
  // check request data
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send('No data sent.');
    return;
  }
  // type checking
  // undefined means 'leave unchanged', null - set to null
  const isValidRequest = typeCheck(`{
    heading: Maybe NonBlankString,
    description: Maybe String,
    priority: Maybe PriorityStrings,
    isPersonal: Maybe Boolean,
    assignee: Maybe NonBlankString | Null,
    completed: Maybe Boolean
  }`, req.body, { customTypes: { ...requestTypes } });
  if (!isValidRequest) {
    res.status(400).send('Data is invalid, check your validation services.');
    return;
  }
  // if user tries to change assignee - check if new value exists
  let assignee;
  if (req.body.assignee) {
    try {
      const assigneeExists = await app.db.pGet(`SELECT id FROM users WHERE id="${req.body.assignee}"`);
      if (!assigneeExists) {
        res.status(400).send('Executor not found.');
        return;
      }
      assignee = assigneeExists;
    } catch (err) {
      res.status(500).send('Unlucky, database error.');
      return;
    }
  }

  console.log('UPDATING TASK'); // eslint-disable-line no-console
  res.sendStatus(200);
};

export default updateTask;
