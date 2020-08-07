'use strict';

const lodash = require('lodash');
const dateFns = require('date-fns');
const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function createBatches() {
  return async (req, res, next) => {
    try {
      const dateTime = dateFns.format(new Date(), 'Pp');

      const allSubscribersGroup = await textIt.getAllSubscribersGroup();

      const groupId = allSubscribersGroup.uuid;
      const numberOfSubscribers = allSubscribersGroup.count;
      const numberOfBatches = Math.ceil(numberOfSubscribers / 100);

      logger.debug(`Creating ${numberOfBatches} batches for ${numberOfSubscribers} subscribers`);

      const batches = [];

      for (let i = 0; i < numberOfBatches; i++) {
        const group = await textIt.createGroup(`Subscribers ${dateTime} - Batch ${i + 1}`);
 
        batches[i] = {
          group,
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

      const data = {
        dateTime,
        numberOfSubscribers,
        numberOfBatches,
        groups: batches.map(group => lodash.pick(group, ['name', 'count', 'group']))
      };

      logger.debug(`Finished creating ${numberOfBatches} batches for ${numberOfSubscribers} subscribers.`);

      return res.send(data);
    } catch (error) {
      return next(error);
    }
  }
};
