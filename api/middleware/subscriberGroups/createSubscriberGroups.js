'use strict';

const lodash = require('lodash');
const logger = require('heroku-logger');

const textIt = require('../../services/text-it');

module.exports = function createBatches() {
  return async (req, res, next) => {
    try {
      // Find the All Subscribers group to split out into batch groups.
      const allSubscribersGroup = await textIt.getAllSubscribersGroup();

      req.groupId = allSubscribersGroup.uuid;
      req.numberOfSubscribers = allSubscribersGroup.count;
      req.numberOfGroups = Math.ceil(req.numberOfSubscribers / 100);

      logger.info(`Creating ${req.numberOfGroups} batches for ${req.numberOfSubscribers} subscribers`);

      req.groups = [];

      // Create the batch groups (and delete first if group already exists).
      for (let i = 0; i < req.numberOfGroups; i++) {
        const name = `Batch ${i + 1}`;
        let group = await textIt.getGroupByName(name);

        if (group) {
          logger.info('Deleting existing group', { group });

          await textIt.deleteGroupById(group.uuid);
        }

        group = await textIt.createGroup(name);

        logger.info('Created group', { group });

        req.groups[i] = lodash.assign(group, { members: [] });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  }
};
