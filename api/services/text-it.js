'use strict';

const client = require('superagent');
const logger = require('heroku-logger');
const queryString = require('query-string');

const config = require('../../config/services/text-it');

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
    .set('Authorization', `Token ${config.apiToken}`);
}

/**
 * Execute a GET request to the TextIt API by URL.
 *
 * @param {String} url
 * @return {Promise}
 */
module.exports.getByUrl = (url) => {
  logger.debug('TextIt GET', { url });

  return client.get(url).set('Authorization', `Token ${config.apiToken}`);
}

/**
 * Fetch a page of contacts by group ID.
 *
 * @param {String} groupId
 * @param {String} cursor
 * @return {Promise}
 */
module.exports.getContactsByGroupId = (groupId, cursor) => {
  return module.exports.get('contacts', { group: groupId, cursor })
    .then(res => res.body);
};

/**
 * Fetch group by ID.
 *
 * @param {String}
 * @return {Promise}
 */
module.exports.getGroupById = (groupId) => {
  return module.exports.get('groups', { uuid: groupId })
    .then(res => res.body.results[0]);
};

/**
 * Fetch the group used to manage all subscribers.
 *
 * @return {Promise}
 */
module.exports.getAllSubscribersGroup = () => {
  return module.exports.get('groups', { uuid: config.groups.allSubscribers })
    .then(res => res.body.results[0]);
}
