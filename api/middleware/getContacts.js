'use strict';

const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function getContacts() {
  return async (req, res, next) => {
    try {
      const apiRes = await textIt.getContactsByGroupId('6384e6d4-b42c-4fd6-9cfa-721ec15c538a');

      logger.debug('TextIt response', apiRes.body);

      return res.send({ data: apiRes.body });
    } catch (error) {
      return next(error);
    }
  }
};