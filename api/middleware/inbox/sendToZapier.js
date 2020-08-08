'use strict';

const logger = require('heroku-logger');
const superagent = require('superagent');

const textIt = require('../../services/text-it');
const zapier = require('../../services/zapier');

module.exports = function sendToZapier() {
  return async (req, res, next) => {
    try {
      const zapierRes = await zapier.postWebhook(data);

      logger.debug('Zapier response', zapierRes.body);

      return res.send('Sent to zapier');
    } catch (error) {
      return next(error);
    }
  }
};
