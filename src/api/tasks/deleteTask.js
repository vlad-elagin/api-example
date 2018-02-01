import app from './../../app';

const deleteTask = async (req, res) => {
  if (!req.body || !req.body.id || typeof req.body.id !== 'string') {
    res.status(400).send('No task ID sent.');
    return;
  }

  // find task
  let task;
  try {
    task = await app.db.pGet(`SELECT author FROM tasks WHERE id="${req.body.id}"`);
    if (!task) {
      res.status(404).send('Task not found.');
      return;
    }
  } catch (err) {
    res.status(500).send('Unlucky, database error.');
    return;
  }

  // check if requesting user own requested task
  if (req.user.userId !== task.author) {
    res.status(403).send('You can remove only your own tasks.');
    return;
  }

  // delete task
  try {
    await app.db.pRun(`DELETE FROM tasks WHERE id="${req.body.id}"`);
    res.status(200).send('Task removed.');
  } catch (err) {
    res.status(500).send('Unlucky, database error.');
  }
};

export default deleteTask;
