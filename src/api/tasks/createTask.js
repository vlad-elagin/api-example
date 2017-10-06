import { typeCheck } from 'type-check';
import * as uuid from 'uuid';
import requestTypes from './../../helpers/requestTypes';
import app from './../../app';

const createTask = async (req, res) => {
  // check request data
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send('No data sent.');
    return;
  }
  // type checking
  const isValidRequest = typeCheck(`{
    header: NonBlankString,
    description: String,
    content: NonBlankString,
    priority: PriorityStrings,
    isPersonal: Boolean,
    executor: NonBlankString | Null,
    completed: Boolean
  }`, req.body, { customTypes: { ...requestTypes } });
  if (!isValidRequest) {
    res.status(400).send('Data is invalid, check your validation services.');
    return;
  }
  // check if executor exists
  let executor;
  if (req.body.executor) {
    try {
      const executorExists = await app.db.pGet(`SELECT id FROM users WHERE id="${req.body.executor}"`);
      if (!executorExists) {
        res.status(400).send('Executor not found.');
        return;
      }
      executor = executorExists;
    } catch (err) {
      res.status(500).send('Unlucky, database error.');
      return;
    }
  } else {
    executor = req.user.userId;
  }
  // create task
  const task = {
    ...req.body,
    id: uuid.v4(),
    created: new Date(),
    creator: req.user.userId,
    executor,
  };
  try {
    await app.db.pRun(`
      INSERT INTO tasks
      (id, header, description, content, priority, created, creator, isPersonal, executor, completed)
      VALUES (
        "${task.id}",
        "${task.header}",
        "${task.description}",
        "${task.content}",
        "${task.priority}",
        "${task.created}",
        "${task.creator}",
        "${task.isPersonal}",
        "${task.executor}",
        "${task.completed}"
      )
    `);
    const newTask = await app.db.pGet(`SELECT * FROM tasks WHERE id="${task.id}"`);
    // convert strings to bool
    newTask.isPersonal = newTask.isPersonal === 'true';
    newTask.completed = newTask.completed === 'true';
    res.status(200).send(newTask);
  } catch (err) {
    res.status(500).send('Unlucky, database error.');
  }
};

export default createTask;
