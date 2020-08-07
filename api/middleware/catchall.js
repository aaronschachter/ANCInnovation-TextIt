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

      const textItRes = await textIt.get('contacts', { uuid: contact.uuid });

      //const { fields, groups } = textItRes.body;

      console.log(textItRes);

       const data = {
        contact: {
          name: contact.name,
          phone: contact.urn.substring(5),
          url:  `https://textit.in/contact/read/${contact.uuid}`,
        },
        message: {
          flowName: flow.name,
          text: results.result.value,
        },
//        fields,
//        groups,
      };   

      console.log(data);

      //const zapierRes = await zapier.postWebhook(data);

      //console.log('Zapier response', zapierRes.body);

      return res.send('Sent to zapier');
    } catch (error) {
      return next(error);
    }
  }
};
