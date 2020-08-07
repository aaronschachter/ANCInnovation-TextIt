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
      const numberOfGroups = Math.ceil(numberOfSubscribers / 100);

      logger.debug(`Creating ${numberOfGroups} batches for ${numberOfSubscribers} subscribers`);

      const groups = [];

      for (let i = 0; i < numberOfGroups; i++) {
        const name = `Subscribers Batch ${i + 1}`;

        let group = await textIt.getGroupByName(name);

        if (group) {
          logger.debug('Deleting existing group', { group });

          await textIt.deleteGroupById(group.uuid);
        }

        group = await textIt.createGroup(name);

        groups[i] = lodash.assign(group, { members: [] });
      }

      let subscribersRes = await textIt.getContactsByGroupId(groupId);

      let { results, next } = subscribersRes;
      let i = 0;

      while (results || next) {
        results.forEach(({ uuid }) => {
          groups[i].members.push(uuid);
          groups[i].count++;

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

      // Now that we've batched all subscribers, add them to the groups we created.
      groups.forEach(async (group) => {
        await textIt.addContactsToGroup(group.members, group.uuid);
      });

      const data = {
        dateTime,
        numberOfSubscribers,
        numberOfGroups,
        groups: groups.map(group => lodash.pick(['uuid', 'name', 'count']))
      };

      logger.debug(`Finished creating ${numberOfGroups} batches for ${numberOfSubscribers} subscribers.`);

      return res.send(data);
    } catch (error) {
      return next(error);
    }
  }
};
