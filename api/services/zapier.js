'use strict';

const client = require('superagent');
const logger = require('heroku-logger');

const { webhookUrl } = require('../../config/services/zapier');

/**
 * Execute a POST request to a Zapier webhook.
 *
 * @param {Object} data
 * @return {Promise}
 */
module.exports.postWebhook = (data) => {
  logger.debug('Zapier POST', { data });

  return client.post(webhookUrl).send(data);
}
