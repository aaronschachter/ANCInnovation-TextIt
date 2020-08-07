'use strict';

const logger = require('heroku-logger');

const catchallMiddleware = require('./middleware/catchall');
const getGroupsMiddleware = require('./middleware/getGroups');
const getContactsMiddleware = require('./middleware/getContacts');

/**
 * API routes.
 */
module.exports = (app) => {
  // GET requests
  app.get('/api/v1/groups', getGroupsMiddleware());
  app.get('/api/v1/contacts', getContactsMiddleware());

  // POST requests
  app.post('/api/v1/catchall', catchallMiddleware());

  // Error handler
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;

    logger.error('Sending response', { status, message });

    return res.status(status).send({ message });
  });
};
