'use strict';

const client = require('superagent');
const logger = require('heroku-logger');
const queryString = require('query-string');

/**
 * Execute a GET request to the TextIt API.
 *
 * @param {String} path
 * @param {Object} query
 * @return {Promise}
 */
function get(path, query = {}) {
  logger.debug('TextIt GET', { path, query });

  return client
    .get(queryString.stringifyUrl({
      url: `https://api.textit.in/api/v2/${path}.json`,
      query,
    }))
    .set('Authorization', 'Token ' + process.env.TEXT_IT_API_TOKEN);
}

/**
 * Fetch contacts by group ID.
 *
 * @return {Promise}
 */
module.exports.getContacts = (query) => {
  return get('contacts', query);
};