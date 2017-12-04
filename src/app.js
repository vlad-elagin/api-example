import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import routes from './routes';
import db from './db/db'; // eslint-disable-line no-unused-vars
import { jwtSecret } from './config/auth';

const app = express();
app.disable('x-powered-by');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// protecting routes from unauthorized usage
app.use(jwt({ secret: jwtSecret }).unless({
  path: [
    // unprotected routes
    '/',
    '/api/login/',
    '/api/register/',
    // temporary stub routes
    '/api/userstub/',
  ],
}));
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Auth token is missing or invalid.');
  }
});

// app.use(express.static(path.join(__dirname, '../public')));

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
