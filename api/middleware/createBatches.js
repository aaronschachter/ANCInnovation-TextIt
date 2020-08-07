'use strict';

const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function createBatches() {
  return async (req, res, next) => {
    try {
      const allSubscribersGroup = await textIt.getAllSubscribersGroup();

      //logger.debug('TextIt All Subscribers group', allSubscribersRes);
      console.log(allSubscribersGroup);

      //const { contact, flow, results } = req.body;

      req.data.group = allSubscribersGroup;

      return res.send({ data: req.data });
    } catch (error) {
      return next(error);
    }
  }
};
