'use strict';

const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function createBatches() {
  return async (req, res, next) => {
    try {
      const allSubscribersGroup = await textIt.getAllSubscribersGroup();

      const groupId = allSubscribersGroup.uuid;
      const numberOfSubscribers = allSubscribersGroup.count;
      const numberOfBatches = Math.ceil(numberOfSubscribers / 100);

      logger.debug(`Creating ${numberOfBatches} batches for ${numberOfSubscribers} subscribers`);

      const batches = [];

      for (let i = 0; i < numberOfBatches; i++) {
        batches[i] = {
          count: 0,
          members: [],
        };
      }

      let subscribersRes = await textIt.getContactsByGroupId(groupId);

      let { results, next } = subscribersRes;
      let i = 0;

      while (results || next) {
        results.forEach(({ uuid }) => {
          batches[i].members.push(uuid);
          batches[i].count++;

          return i === 7 ? i = 0 : i++;     
        });
        logger.debug(`Batched ${results.length} subscribers`);

        if (next) {
          subscribersRes = await textIt.getByUrl(next);

          results = subscribersRes.body.results;
          next = subscribersRes.body.next;       
        } else {
          break;
        }
      }

      logger.debug('Finished creating batches');

      req.data = Object.assign(req.data, { batches }); 

      return res.send({ data: req.data });
    } catch (error) {
      return next(error);
    }
  }
};
