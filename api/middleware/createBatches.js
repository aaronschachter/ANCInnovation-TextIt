'use strict';

const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function createBatches() {
  return async (req, res, next) => {
    try {
      const allSubscribersGroup = await textIt.getAllSubscribersGroup();

      const groupId = allSubscribersGroup.uuid;
      const numberOfBatches = Math.ceil(allSubscribersGroup.count / 100);
      const batches = [];

      for (let i = 0; i < numberOfBatches; i++) {
        batches[i] = {
          count: 0,
          members: [],
        };
      }

      let i = 0;

      let subscribersRes = await textIt.getContactsByGroupId(groupId);

      let { results, next } = subscribersRes;

      while (results || next) {
        results.forEach(({ uuid }) => {
          logger.debug('Adding user to batch', { i, uuid });

          batches[i].members.push(uuid);
          batches[i].count++;

          if (i === 7) {
            i = 0;

            return;
          }

          i++;    
        });

        subscribersRes = await textIt.getByUrl(next);
        results = subscribersRes.results;
        next = subscribersRes.next;
      }

      logger.debug('Finished creating batches');
 
      req.data = Object.assign(req.data, { batches }); 

      return res.send({ data: req.data });
    } catch (error) {
      return next(error);
    }
  }
};
