'use strict';

const logger = require('heroku-logger');

const catchallMiddleware = require('./middleware/catchall');

const authenticateMiddleware = require('./middleware/authenticate');
const addSubscribersMiddleware = require('./middleware/subscriberGroups/addSubscribers');
const getSubscribersMiddleware = require('./middleware/subscriberGroups/getSubscribers');
const createSubscriberGroupsMiddleware = require('./middleware/subscriberGroups/createSubscriberGroups');

/**
 * API routes.
 */
module.exports = (app) => {
  app.use(authenticateMiddleware());

  app.post('/api/v1/batches',
    createSubscriberGroupsMiddleware(),
    getSubscribersMiddleware(),
    addSubscribersMiddleware());

  app.post('/api/v1/support', catchallMiddleware());

  // Error handler
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;

    logger.error('Sending response', { status, message });

    return res.status(status).send({ message });
  });
};
