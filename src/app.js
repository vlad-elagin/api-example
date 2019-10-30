import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
// eslint-disable-next-line no-unused-vars
import db from '@db/db';
import routes from '@root/routes';
import { jwtSecret } from '@config/auth';

const app = express();
app.disable('x-powered-by');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// protecting routes from unauthorized usage
app.use(jwt({
  secret: jwtSecret,
}).unless({
  path: [
    // unprotected routes
    '/',
    '/api/login/',
    '/api/register/',
  ],
}));
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Auth token is missing or invalid.');
  }
});

// Routes
app.use('/', routes);

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message,
    });
});

export default app;
