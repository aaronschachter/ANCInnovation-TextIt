'use strict';

const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function createBatches() {
  return async (req, res, next) => {
    try {
      const allSubscribersGroup = await textIt.getAllSubscribersGroup();

      const numberOfBatches = Math.ceil(allSubscribersGroup.count / 100);

      const batches = [];

      for (let i = 0; i < numberOfBatches; i++) {
        batches[i] = [];
      }

      const subscribersRes = await textIt.getContactsByGroupId(allSubscribersGroup.uuid);

      const { results, next } = subscribersRes.body;

      let i = 0;

      results.forEach(({ uuid }) => {
        logger.debug('Adding user to batch', { i, uuid });

        batches[i].push(uuid);

        if (i === 7) {
          i = 0;

          return;
        }

        i++;    
      });

      //const { contact, flow, results } = req.body;
      req.data.group = allSubscribersGroup;
      req.data = Object.assign(req.data, { batches }); 

      return res.send({ data: req.data });
    } catch (error) {
      return next(error);
    }
  }
};
