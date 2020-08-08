'use strict';

const logger = require('heroku-logger');

const authenticateMiddleware = require('./middleware/authenticate');
const getContactMiddleware = require('./middleware/inbox/getContact');
const sendToZapierMiddleware = require('./middleware/inbox/sendToZapier');
const addSubcribersMiddleware = require('./middleware/subscriberGroups/addSubscribers');
const getSubcribersMiddleware = require('./middleware/subscriberGroups/getSubscribers');
const createSubscriberGroupsMiddleware = require('./middleware/subscriberGroups/createSubscriberGroups');
const parseFlowEventMiddleware = require('./middleware/inbox/parseFlowEvent');

/**
 * API routes.
 */
module.exports = (app) => {
  app.get('/', (req, res) => res.send('OK'));

  app.use(authenticateMiddleware());

  app.post('/api/v1/subscriber-groups',
    createSubscriberGroupsMiddleware(),
    getSubcribersMiddleware(),
    addSubcribersMiddleware());

  app.post('/api/v1/inbox',
    parseFlowEventMiddleware(),
    getContactMiddleware(),
    sendToZapierMiddleware());

  // Error handler
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;

    logger.error('Sending response', { status, message });

    return res.status(status).send({ message });
  });
};
