'use strict';

const co = require('co');
const mongodb = require('mongo-mock');
// Short asynchronicity
mongodb.max_delay = 1;
const MongoClient = mongodb.MongoClient;
const createApp = require('../').createApp;

/**
 * Asynchronously create the app with a mock database
 * You can chain to the promise returned by this function
 * to work with the created app
 */
exports.createTestApp = () => co(function* () {
  // Emit error message without logging
  const errorHandler = (err, req, res, next) =>
    res.status(err.status || 500).json({
      message: err.message,
    })
  ;
  /*
    FIXME: https://github.com/williamkapke/mongo-mock/pull/5
    const db = yield MongoClient.connect(process.env.MONGODB_DSN);
  */
  const dfd = Promise.defer();
  MongoClient.connect(process.env.MONGODB_DSN, (err, db) => dfd.resolve(db));
  let db = yield dfd.promise;

  return createApp(db, errorHandler);
}).catch(err => console.error(err.stack));
