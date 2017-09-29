import { Router } from 'express';

// TASKS CRUD
import createTask from './api/tasks/createTask';
import getTasks from './api/tasks/getTasks';
import updateTask from './api/tasks/updateTask';
import deleteTask from './api/tasks/deleteTask';

// USERS CRUD
import getStubUsers from './api/users/usersStub';

const routes = Router();

routes.get('/', (req, res) => {
  res.sendStatus(200);
});

routes.route('/api/task/')
  .get(getTasks)
  .post(createTask)
  .put(updateTask)
  .delete(deleteTask);

routes.route('/api/users')
  .get(getStubUsers);

export default routes;
