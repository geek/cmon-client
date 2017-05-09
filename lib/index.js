'use strict';

const Hoek = require('hoek');
const Wreck = require('wreck');


const internals = {
  defaults: {
    cert: process.env.CMON_CERT,
    key: process.env.CMON_KEY,
    datacenters: [
      'eu-ams-1',
      'us-east-1',
      'us-east-2',
      'us-east-3',
      'us-sw-1',
      'us-west-1'
    ]
  }
};


module.exports = class CMon {
  constructor (options) {
    this._settings = Hoek.applyToDefaults(internals.defaults, options || {});
  }

  discover (options, cb) {

  }

  metrics (options, cb) {

  }
};
