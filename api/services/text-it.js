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
module.exports.get = (path, query = {}) => {
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
 * @param {String}
 * @return {Promise}
 */
module.exports.getContactsByGroupId = (groupId) => {
  return module.exports.get('contacts', { group: groupId });
};

/**
 * Fetch group by ID.
 *
 * @param {String}
 * @return {Promise}
 */
module.exports.getGroupById = (groupId) => {
  return module.exports.get('groups', { uuid: groupId });
};
