'use strict';

const logger = require('heroku-logger');

const getGroupsMiddleware = require('./middleware/getGroups');
const getContactsMiddleware = require('./middleware/getContacts');

/**
 * API routes.
 */
module.exports = (app) => {
  app.get('/api/v1/contacts', getContactsMiddleware());
  app.get('/api/v1/groups', getGroupsMiddleware());

  app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;

    logger.error('Sending response', { status, message });

    return res.status(status).send({ message });
  });
};
