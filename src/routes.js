import { Router } from 'express';

// TASKS CRUD
import createTask from './api/tasks/createTask';
import getTasks from './api/tasks/getTasks';
import updateTask from './api/tasks/updateTask';
import deleteTask from './api/tasks/deleteTask';

// USERS CRUD
import getUsers from './api/users/getUsers';
import createUser from './api/users/createUser';

// AUTH CRUD
import loginUser from './api/auth/login';

const routes = Router();

routes.get('/', (req, res) => {
  res.sendStatus(200);
});

routes.post('/api/login', loginUser);
routes.post('/api/register', createUser);

routes.route('/api/tasks')
  .get(getTasks)
  .post(createTask)
  .patch(updateTask)
  .delete(deleteTask);

routes.route('/api/users')
  .get(getUsers);

export default routes;
