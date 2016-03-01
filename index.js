'use strict';

const Promise = require('bluebird');
const co = require('co');

const bodyParser = require('body-parser');
const express = require('express');

const port = Number(process.env.PORT || 4000);

/*
 * If we are running this as the main module, we are running the app for actual
 * use. Set up all of the usual DB connection/authentication and other
 * requirements. This is different from a setup for testing or other inclusion
 * of this module
 */
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

    const app = createApp(errorHandler);
    yield startServer(app, port);

    console.log(`Calculator is listening on port ${port}`);
  });
}

/**
 * Create the app with the provided inputs such loggers, db connections, and
 * middlewares. This allows a test to specify a middleware that can skip
 * authorization, for example and mocked logging/database connections
 */
function createApp(errorHandler) {
  const app = express();

  // Apply general middlewares
  app.use(bodyParser.json());

  // Apply routes
  app.use('/simple-calc', require('./simple-calc'));

  app.use(errorHandler);

  return app;
}

function startServer(app, port) {
  return Promise.promisify(app.listen).call(app, port);
}

exports.createApp = createApp;
