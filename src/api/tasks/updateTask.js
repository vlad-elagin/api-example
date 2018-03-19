import { typeCheck } from 'type-check';
import requestTypes from '@helpers/requestTypes';
import buildQuery from '@helpers/queryBuilder';
import parseBooleans from '@helpers/parseBooleans';
import app from '@root/app';

const updateTask = async (req, res) => {
  // check request data
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send('No data sent.');
    return;
  }
  // check that task id is sent
  if (!req.body.id) {
    res.status(400).send('Wrong task ID.');
    return;
  }
  // check task existense
  const taskToUpdate = await app.db.pGet(`SELECT * FROM tasks WHERE id="${req.body.id}"`);
  if (!taskToUpdate) {
    res.status(400).send('Wrong task ID.');
    return;
  }
  // check if requesting user is author of task
  if (taskToUpdate.author !== req.user.userId) {
    res.status(403).send('You are not permitted to change this task.');
    return;
  }
  // type checking
  // undefined means 'leave unchanged', null - set to null
  const isValidRequest = typeCheck(`{
    id: NonBlankString,
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
  if ('assignee' in req.body) {
    try {
      const assigneeExists = await app.db.pGet(`SELECT id FROM users WHERE id="${req.body.assignee}"`);
      if (!assigneeExists) {
        res.status(400).send('Assignee not found.');
        return;
      }
      assignee = assigneeExists;
    } catch (err) {
      res.status(500).send('Unlucky, database error.');
      return;
    }
  }
  // prepare sql request for updating
  const fieldsAvailableForUpdate = [
    'heading',
    'description',
    'priority',
    'isPersonal',
    'completed',
    'assignee',
  ];
  const updateSql = buildQuery(
    Object.assign({}, req.body, { assignee: assignee.id }),
    fieldsAvailableForUpdate,
  );
  // update task record in db
  try {
    await app.db.pRun(`
      UPDATE tasks
      SET ${updateSql}
      WHERE id="${req.body.id}"
    `);
    let updatedTask = await app.db.pGet(`SELECT * FROM tasks WHERE id="${req.body.id}"`);
    updatedTask = parseBooleans(updatedTask, ['completed', 'isPersonal']);
    res.status(200).send(updatedTask);
  } catch (err) {
    res.status(500).send('Unlucky, database error.');
  }
};

export default updateTask;
