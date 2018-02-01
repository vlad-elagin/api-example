import { typeCheck } from 'type-check';
import * as uuid from 'uuid';
import parseBooleans from './../../helpers/parseBooleans';
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
    heading: NonBlankString,
    description: String,
    priority: PriorityStrings,
    isPersonal: Boolean,
    assignee: NonBlankString | Null,
    completed: Boolean
  }`, req.body, { customTypes: { ...requestTypes } });
  if (!isValidRequest) {
    res.status(400).send('Data is invalid, check your validation services.');
    return;
  }
  // check if executor exists
  let assignee;
  if (req.body.assignee) {
    try {
      const executorExists = await app.db.pGet(`SELECT id FROM users WHERE id="${req.body.assignee}"`);
      if (!executorExists) {
        res.status(400).send('Executor not found.');
        return;
      }
      assignee = executorExists;
    } catch (err) {
      res.status(500).send('Unlucky, database error.');
      return;
    }
  } else {
    assignee = req.user.userId;
  }
  // create task
  const task = {
    ...req.body,
    id: uuid.v4(),
    created: new Date(),
    author: req.user.userId,
    assignee,
  };
  try {
    await app.db.pRun(`
      INSERT INTO tasks
      (id, heading, description, priority, created, author, isPersonal, assignee, completed)
      VALUES (
        "${task.id}",
        "${task.heading}",
        "${task.description}",
        "${task.priority}",
        "${task.created}",
        "${task.author}",
        "${task.isPersonal}",
        "${task.assignee}",
        "${task.completed}"
      )
    `);
    let newTask = await app.db.pGet(`SELECT * FROM tasks WHERE id="${task.id}"`);
    newTask = parseBooleans(newTask, ['completed', 'isPersonal']);
    res.status(200).send(newTask);
  } catch (err) {
    res.status(500).send('Unlucky, database error.');
  }
};

export default createTask;
