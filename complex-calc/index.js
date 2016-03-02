'use strict';

/**
 * Generic calc routes
 */
const Promise = require('bluebird');
const co = require('co');
const router = require('express').Router();
const wolframAlpha = Promise.promisifyAll(
  require('wolfram-alpha').createClient(
    process.env.WA_API_KEY,
    {format: 'plaintext'}
  )
);

router.get('/query', (req, res, next) => co(function* () {
  if (!req.query.query) {
    const err = new Error('You must provide a query');
    err.status = 400;
    throw err;
  }

  const pods = yield wolframAlpha.queryAsync(req.query.query);
  if (!pods.length) {
    const err = new Error('Result could not be calculated. Sorry!');
    err.status = 500;
    throw err;
  }

  // The primary subpod contains the result
  const result = pods.find(pod => pod.primary).subpods[0].text;
  res.json({result});
}).catch(next));

module.exports = router;
