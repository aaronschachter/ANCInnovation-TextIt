'use strict';

const lodash = require('lodash');
const logger = require('heroku-logger');

const textIt = require('../../services/text-it');

module.exports = function addSubscribers() {
  return async (req, res, next) => {
    try {
      const { groups, numberOfGroups, numberOfSubscribers } = req;

      // Now that we've batched all subscribers, add them to the groups we created.
      groups.forEach(async (group) => {
        await textIt.addContactsToGroup(group.members, group.uuid);
      });

      req.data = {
        subscribers_count: numberOfSubscribers,
        groups_count: numberOfGroups,
        groups: groups.map(group => lodash.pick(group, ['uuid', 'name', 'count']))
      };

      logger.debug(`Finished creating ${numberOfGroups} batches for ${numberOfSubscribers} subscribers.`);

      return next();
    } catch (error) {
      return next(error);
    }
  }
};
