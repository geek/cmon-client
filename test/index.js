'use strict';

const Code = require('code');
const Lab = require('lab');
const CMon = require('../');


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('constructor', () => {
  it('creates a new instance of CMON Client', (done) => {
    const fn = function () {
      const cmon = new CMon();
      expect(cmon).to.exist();
    };

    expect(fn).to.not.throw();
    done();
  });
});
