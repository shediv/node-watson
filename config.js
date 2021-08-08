const dotenv = require('dotenv');

dotenv.config();

const config = {
  apiKey: process.env.API_KEY,
  source: 'en',
  target: 'hi',
  url: process.env.WATSON_URL,
  version: '2019-01-10'
};

module.exports = config;