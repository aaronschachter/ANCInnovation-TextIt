'use strict';

const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function getGroups() {
  return async (req, res, next) => {
    try {
      const apiRes = await textIt.get('groups', req.query);

      const { next, prev, results } = apiRes.body;

      return res.send({ meta: { next, prev }, data: results });
    } catch (error) {
      return next(error);
    }
  }
};