'use strict';

const logger = require('heroku-logger');
const superagent = require('superagent');

const zapier = require('../../services/zapier');

module.exports = function sendToZapier() {
  return async (req, res, next) => {
    try {
      if (zapier.isDisabled()) {
        logger.info('Skipping send to Zaper');
      } else {
        const zapierRes = await zapier.postWebhook(req.data);

        logger.debug('Zapier response', zapierRes.body);
      }

      return res.send(req.data);
    } catch (error) {
      return next(error);
    }
  }
};
