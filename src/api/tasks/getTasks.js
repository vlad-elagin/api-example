import app from '@root/app';

const getTasks = async (req, res) => {
  if (req.query && req.query.user_id) {
    try {
      // check user existence
      const specifiedUser = await app.db.pGet(`SELECT * FROM users WHERE id="${req.query.user_id}"`);
      if (!specifiedUser) {
        res.status(400).send('User not found.');
        return;
      }
      // get his tasks excluding personal ones
      const tasks = await app.db.pAll(`
        SELECT * FROM tasks WHERE author="${req.query.user_id}" AND isPersonal="false"
      `);
      if (tasks.length === 0) {
        res.status(200).send('Specified user doesn\'t have public tasks.');
        return;
      }
      res.status(200).send(tasks);
      return;
    } catch (err) {
      res.status(500).send('Unlucky, database error.');
    }
  }
  // get tasks of requesting user
  try {
    const tasks = await app.db.pAll(`SELECT * FROM tasks WHERE author="${req.user.userId}"`);
    if (tasks) res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send('Unlucky, database error.');
  }
};

export default getTasks;
