import db from '../../db/db';

const getTasks = async (req, res) => {
  console.log('GETTING TASKS');
  const tasks = await db.get('SELECT * FROM tasks');
  console.log('tasks are ', tasks);
  res.sendStatus(200);
}

export default getTasks;
