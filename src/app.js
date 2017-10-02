import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';
import db from './db/db'; // eslint-disable-line no-unused-vars

const app = express();
app.disable('x-powered-by');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
