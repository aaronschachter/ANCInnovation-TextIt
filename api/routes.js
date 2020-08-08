'use strict';

const logger = require('heroku-logger');

const catchallMiddleware = require('./middleware/catchall');
const getGroupsMiddleware = require('./middleware/getGroups');
const getContactsMiddleware = require('./middleware/getContacts');
const authenticateMiddleware = require('./middleware/authenticate');
const createBatchesMiddleware = require('./middleware/createBatches');
const parseFlowEventMiddleware = require('./middleware/parseFlowEvent');

/**
 * API routes.
 */
module.exports = (app) => {
  app.use(authenticateMiddleware());

  app.get('/api/v1/groups', getGroupsMiddleware());
  app.get('/api/v1/contacts', getContactsMiddleware());

  app.post('/api/v1/batches',
    parseFlowEventMiddleware(),
    createBatchesMiddleware());

  app.post('/api/v1/support', catchallMiddleware());

  // Error handler
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;

    logger.error('Sending response', { status, message });

    return res.status(status).send({ message });
  });
};
