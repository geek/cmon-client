'use strict';

const Https = require('https');
const Hoek = require('hoek');
const Wreck = require('wreck');
const VAsync = require('vasync');


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

    const agent = new Https.Agent({
      key: this._settings.key,
      cert: this._settings.cert,
      rejectUnauthorized: false
    });

    this._wreck = Wreck.defaults({ agent });
  }

  discover (options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    Hoek.assert(typeof cb === 'function', 'callback is required');
    const settings = Hoek.applyToDefaults(this._settings, options || {});

    const func = (datacenter, next) => {
      const baseUrl = (datacenter.indexOf('http') === 0) ? datacenter : `https://cmon.${datacenter}.zone:9163`;
      const url = `${baseUrl}/v1/discover`;

      this._wreck.get(url, { json: true }, (err, res, payload) => {
        return next(err, payload);
      });
    };

    VAsync.forEachParallel({
      func,
      inputs: settings.datacenters
    }, (err, results) => {
      if (err) {
        return cb(err);
      }

      if (!results.operations) {
        return cb(null, []);
      }

      const containers = [];
      results.operations.forEach((operation) => {
        operation.result.containers.forEach((container) => {
          containers.push(container);
        });
      });

      cb(null, containers);
    });
  }

  metrics (options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    Hoek.assert(typeof cb === 'function', 'callback is required');
    const settings = Hoek.applyToDefaults(this._settings, options || {});
  }
};
