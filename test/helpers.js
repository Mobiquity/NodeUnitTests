const createApp = require('../').createApp;

exports.createTestApp = function () {
  // Emit error message without logging
  return createApp((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
    });
  });
}
