# ToDo API

Simple API for todo app with authentication.

## Getting Started

Clone project, cd into its folder and perform
```
yarn install
```
to install dependencies. Then use
```
yarn start
```
to run project and
```
yarn test
```
to run test suite.

App was developed and tested under linux only!

# API documentation

This app uses JWT to protect some routes. For now you can only login and register without supplying auth header.

## Unprotected endpoints

### Register
```
POST /api/register/
```
Creates new user. Supplied data should have following shape:
```
{
  "username": "username",
  "password": "password",
  "email": "test@test.com"
}
```
Username and password should be 6+ chars and email needs to be valid.

### Login
```
POST /api/login/
```
Logs user in and responding with json web token and some data about logged user. Request is:
```
{
  "login": "username", // can be username or email
  "password": "password"
}
```
Response is:
```
{
  "token": "long long string",
  "user": {
    "id": "another long string",
    "username": "username",
    "password": "password"
  }
}
```

## Protected endpoints

### Tasks - Create
```
POST /api/tasks/
```
Creates new task. Supplied data should have following shape:
```
{
  "header": "Task title.", // non blank string
  "description": "", // string (can be empty)
  "content": "I need to go for milk.", // non blank string
  "priority": "low", // one of 'low', 'medium', 'high'
  "isPersonal": false, // boolean
  "executor": "id of user to assign on this task", // if null - requesting user will be assigned
  "completed": false // boolean
}
```
Response would be object of this task with task id.

### Tasks - Get
```
GET /api/tasks/
GET /api/tasks/?user_id=<user id string>
```
Gets an array of tasks. If no user id specified - returns tasks of currently logged in user.
If fetching tasks of another user - returns his non-private tasks list.
