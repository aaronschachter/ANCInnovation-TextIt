'use strict';

const logger = require('heroku-logger');

/**
 * API routes.
 */
module.exports = (app) => {
  app.use(require('./middleware/authenticate'));

  app.post('/api/v1/subscriberGroups',
    require('./middleware/subscriberGroups/createSubscriberGroups'),
    require('./middleware/subscriberGroups/getSubscribers'),
    require('./middleware/subscriberGroups/addSubscribers'));

  app.post('/api/v1/inbox',
    require('./middleware/inbox/parseFlowEvent'),
    require('./middleware/inbox/sendToZapier'));

  // Error handler
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;

    logger.error('Sending response', { status, message });

    return res.status(status).send({ message });
  });
};
