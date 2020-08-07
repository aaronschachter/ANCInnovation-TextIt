'use strict';

const client = require('superagent');
const logger = require('heroku-logger');

/**
 * Execute a POST request to a Zapier webhook.
 *
 * @param {Object} data
 * @return {Promise}
 */
module.exports.postWebhook = (data) => {
  logger.debug('Zapier POST', { data });

  return superagent.post(process.env.ZAPIER_WEBHOOK_URL)
    .send(data);
}
