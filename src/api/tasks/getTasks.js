import app from './../../app';

const getTasks = async (req, res) => {
  if (req.query && req.query.user_id) {
    // get tasks for specified user
  }
  // get tasks of requesting user
  console.log('requesting user is ', req.user);
  const tasks = await app.db.pAll('SELECT * FROM tasks');
  console.log('query is', req.query);
  if (tasks && tasks.length === 0) {
    res.status(200).send([]);
  }
};

export default getTasks;
