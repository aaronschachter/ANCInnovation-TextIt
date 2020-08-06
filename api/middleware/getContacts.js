'use strict';

const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function getContacts() {
  return async (req, res, next) => {
    try {
      const apiRes = await textIt.getContactsByGroupId('6384e6d4-b42c-4fd6-9cfa-721ec15c538a');

     
      const { next, prev, results } = apiRes.body;

      const data = results.map((contact) => {
        const { uuid, groups, urns } = contact;
        return { uuid, phone: urns[0], groups };
      });

      logger.debug('Sending response', data);

      return res.send({ data, meta: { next, prev } });
    } catch (error) {
      return next(error);
    }
  }
};