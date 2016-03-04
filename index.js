'use strict';

const Promise = require('bluebird');
const co = require('co');

const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const express = require('express');

const port = Number(process.env.PORT || 4000);

/*
 * If we are running this as the main module, we are running the app for actual
 * use. Set up all of the usual DB connection/authentication and other
 * requirements. This is different from a setup for testing or other inclusion
 * of this module
 */
/* istanbul ignore if */
if (require.main === module) {
  co(function* () {

    /**
     * Generic error handling -- all errors are passed through the `next`
     * callback during route lifecycle
     */
    const errorHandler = (err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({
        message: err.message,
      });
    };

    const db = yield MongoClient.connect(process.env.MONGODB_DSN);

    const app = createApp(db, errorHandler);
    yield Promise.promisify(app.listen).call(app, port);

    console.log(`Calculator is listening on port ${port}`);
  }).catch(err => console.error(err.stack));
}

/**
 * Create the app with the provided inputs such loggers, db connections, and
 * middlewares. This allows a test to specify a middleware that can skip
 * authorization, for example and mocked logging/database connections
 */
function createApp(db, errorHandler) {
  const app = express();

  // Apply general middlewares
  app.use(bodyParser.json());

  app.set('db', db);
  app.set('calculation', require('./calculation/calculation')(app));

  // Apply routes
  app.use('/simple-calc', require('./simple-calc'));
  app.use('/complex-calc', require('./complex-calc'));

  app.use(errorHandler);

  return app;
}

exports.createApp = createApp;
