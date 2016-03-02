'use strict';

/**
 * Generic calc routes
 */
const co = require('co');
const lodash = require('lodash');
const router = require('express').Router();

router.use((req, res, next) => co(function* () {
  req.query.leftOperand = +req.query.leftOperand;
  req.query.rightOperand = +req.query.rightOperand;

  if (lodash.some(req.query, isNaN)) {
    const err = new Error('Both operands must be numbers, dingus');
    err.status = 400;
    throw err;
  }

  next();
}).catch(next));

router.get('/add', (req, res, next) => co(function* () {
  res.json({
    result: req.query.leftOperand + req.query.rightOperand,
  });

  req.app.get('calculation').storeCalculation('simple', 'add', req.query);
}).catch(next));

router.get('/subtract', (req, res, next) => co(function* () {
  res.json({
    result: req.query.leftOperand - req.query.rightOperand,
  });

  req.app.get('calculation').storeCalculation('simple', 'subtract', req.query);
}).catch(next));

router.get('/multiply', (req, res, next) => co(function* () {
  res.json({
    result: req.query.leftOperand * req.query.rightOperand,
  });

  req.app.get('calculation').storeCalculation('simple', 'multiply', req.query);
}).catch(next));

router.get('/divide', (req, res, next) => co(function* () {
  const rightOperand = req.query.rightOperand;
  if (0 === rightOperand) {
    const err = new Error('Division by zero');
    err.status = 500;
    throw err;
  }

  res.json({
    result: req.query.leftOperand / rightOperand,
  });
  req.app.get('calculation').storeCalculation('simple', 'divide', req.query);
}).catch(next));

module.exports = router;
