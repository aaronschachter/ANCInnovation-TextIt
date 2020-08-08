'use strict';

const logger = require('heroku-logger');

module.exports = function parseFlowEvent() {
  return async (req, res, next) => {
    try {
      const { body } = req;

      logger.debug('Received TextIt flow event', { body });

      const { contact, flow, results } = req.body;

      req.data = {
        contact,
        flow,
        results
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }
};
