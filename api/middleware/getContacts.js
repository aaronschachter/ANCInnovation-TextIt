'use strict';

const logger = require('heroku-logger');

const textIt = require('../services/text-it');

module.exports = function getContacts() {
  return async (req, res, next) => {
    try {
      const apiRes = await textIt.getContacts(req.query);

      const { next, prev, results } = apiRes.body;

      const data = results.map((contact) => {
        const { uuid, groups, urns } = contact;
        return { uuid, phone: urns[0], groups };
      });

      return res.send({ meta: { next, prev }, data });
    } catch (error) {
      return next(error);
    }
  }
};