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
function get(path, query = {}) {
  logger.debug('TextIt GET', { path, query });

  return client
    .get(queryString.stringifyUrl({
      url: `https://api.textit.in/api/v2/${path}.json`,
      query,
    }))
    .set('Authorization', `Token ${config.apiToken}`);
}

/**
 * Execute a POST request to the TextIt API.
 *
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
function post(path, data) {
  logger.debug('TextIt POST', { path, data });

  return client
    .post(`https://api.textit.in/api/v2/${path}.json`)
    .set('Authorization', `Token ${config.apiToken}`)
    .send(data);
}

/**
 * Execute a GET request to the TextIt API by URL.
 *
 * @param {String} url
 * @return {Promise}
 */
module.exports.getByUrl = (url) => {
  logger.debug('TextIt GET', { url });

  return client.get(url)
    .set('Authorization', `Token ${config.apiToken}`);
}

/**
 * Fetch a page of contacts by group ID.
 *
 * @param {String} groupId
 * @param {String} cursor
 * @return {Promise}
 */
module.exports.getContactsByGroupId = (groupId, cursor) => {
  return get('contacts', { group: groupId, cursor })
    .then(res => res.body);
};

/**
 * Fetch group by ID.
 *
 * @param {String}
 * @return {Promise}
 */
module.exports.getGroupById = (groupId) => {
  return get('groups', { uuid: groupId })
    .then(res => res.body.results[0]);
};

/**
 * Fetch the group used to manage all subscribers.
 *
 * @return {Promise}
 */
module.exports.getAllSubscribersGroup = () => {
  return get('groups', { uuid: config.groups.allSubscribers })
    .then(res => res.body.results[0]);
}

/**
 * Create a new group.
 *
 * @param {String} name
 * @return {Promise}
 */
module.exports.createGroup = (name) => {
  return post('groups', { name })
    .then(res => res.body);
}

/**
 * Returns web URL for a contact.
 *
 * @param {String} contactId
 * @return {String}
 */
module.exports.getUrlForContactId = (contactId) => {
  return `https://textit.in/contact/read/${contactId}`;
}

/**
 * Returns web URL for a group.
 *
 * @param {String} groupId
 * @return {String}
 */
module.exports.getUrlForGroupId = (groupId) => {
  return `https://textit.in/contact/filter/${groupId}`;
}
