'use strict';

const Https = require('https');
const Hoek = require('hoek');
const Wreck = require('wreck');


const internals = {
  defaults: {
    cert: process.env.CMON_CERT,
    key: process.env.CMON_KEY,
    datacenter: 'cmon.us-sw-1.zone:9163'
  }
};


module.exports = class CMon {
  constructor (options) {
    this._settings = Hoek.applyToDefaults(internals.defaults, options || {});

    Hoek.assert(this._settings.key, 'options.key or CMON_KEY env variable is required');
    Hoek.assert(this._settings.cert, 'options.cert or CMON_CERT env variable is required');
    Hoek.assert(this._settings.datacenter, 'options.datacenter is required');

    const agent = new Https.Agent({
      key: this._settings.key,
      cert: this._settings.cert,
      rejectUnauthorized: false
    });

    this._wreck = Wreck.defaults({ agent });
  }

  discover (cb) {
    Hoek.assert(typeof cb === 'function', 'callback is required');

    const url = `https://${this._settings.datacenter}/v1/discover`;

    this._wreck.get(url, { json: true }, (err, res, payload) => {
      if (err) {
        return cb(err);
      }


      return cb(null, payload.containers);
    });
  }

  metrics (id, cb) {
    Hoek.assert(id, 'id is required');
    Hoek.assert(typeof cb === 'function', 'callback is required');

    const url = `https://${id}.${this._settings.datacenter}/v1/metrics`;
    this._wreck.get(url, (err, res, payload) => {
      if (err) {
        return cb(err);
      }

      return cb(null, payload.toString());
    });
  }
};
