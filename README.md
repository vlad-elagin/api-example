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

Work in progress...
