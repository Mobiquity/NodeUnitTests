/**
 * Store requested calculations in a database for some reason
 */

const co = require('co');

module.exports = app => {
  const db = app.get('db');

  function storeCalculation(type, oper, params) {
    return co(function* () {
      yield db.collection('calculations').insert({type, oper, params});
    }).catch(err => console.error(err.stack));
  }

  return {
    storeCalculation,
  };
};
