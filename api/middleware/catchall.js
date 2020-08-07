'use strict';

const logger = require('heroku-logger');
const superagent = require('superagent');

const textIt = require('../services/text-it');
const zapier = require('../services/zapier');

module.exports = function getSupport() {
  return async (req, res, next) => {
    try {
      console.log(req.body);

      const { contact, flow, results } = req.body;

      const data = {
        contact,
        flowName: flow.name,
        messageText: results.result.value,
        url: `https://textit.in/contact/read/${contact.uuid}`,
      };

      const textItRes = await textIt.get('contacts', { uuid: contact.uuid });

      console.log('TextIt response', textItRes.body);

      const zapierRes = await zapier.postWebhook(data);

      console.log('Zapier response', zapierRes.body);

      return res.send('Sent to zapier');
    } catch (error) {
      return next(error);
    }
  }
};
