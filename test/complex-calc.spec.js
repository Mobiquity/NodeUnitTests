'use strict';

const co = require('co');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const nock = require('nock');
const fs = require('fs');

nock.enableNetConnect();

describe('Complex Calculator', () => {
  let app;
  before(done => co(function* () {
    app = request(yield require('./helpers').createTestApp());
    done();
  }));

  describe('GET /query', () => {
    it('prevents calculation without a query', done => app
      .get('/complex-calc/query')
      .expect(400)
      .expect(res => expect(res.body.message).to.contain('You must provide a query'))
      .end(done)
    );

    const nockQueryDefaults = {
      units: 'metric',
      format: 'plaintext',
      primary: 'true',
      appid: process.env.WA_API_KEY,
    };

    it('performs arithmetic queries', done => {
      const input = '2*2';
      nock('http://api.wolframalpha.com')
        .get('/v2/query')
        .query(Object.assign({input}, nockQueryDefaults))
        .reply(200, () => fs.createReadStream(__dirname + '/wa-responses/2x2-response.xml'));

      app
        .get('/complex-calc/query')
        .query({query: input})
        .expect(200)
        .expect(res => expect(res.body.result).to.equal('4'))
        .end(done)
    });

    it('performs binary conversion', done => {
      const input = '219 to binary';
      nock('http://api.wolframalpha.com')
        .get('/v2/query')
        .query(Object.assign({input}, nockQueryDefaults))
        .reply(200, () => fs.createReadStream(__dirname + '/wa-responses/0b219-response.xml'));

      app
        .get('/complex-calc/query')
        .query({query: input})
        .expect(200)
        .expect(res => expect(res.body.result).to.equal('11011011_2'))
        .end(done)
    });

    it('performs metric conversion', done => {
      const input = '120 kilometers to meters';
      nock('http://api.wolframalpha.com')
        .get('/v2/query')
        .query(Object.assign({input}, nockQueryDefaults))
        .reply(200, () => fs.createReadStream(__dirname + '/wa-responses/km-to-m-response.xml'));

      app
        .get('/complex-calc/query')
        .query({query: input})
        .expect(200)
        .expect(res => expect(res.body.result).to.equal('120000 meters'))
        .end(done)
    });

    it('indicates inability to calculate result', done => {
      const input = '!@#$%^&*()!@#$%^&*()!@#$%^&*(';
      nock('http://api.wolframalpha.com')
        .get('/v2/query')
        .query(Object.assign({input}, nockQueryDefaults))
        .reply(200, () => fs.createReadStream(__dirname + '/wa-responses/no-result.xml'));

      app
        .get('/complex-calc/query')
        .query({query: input})
        .expect(500)
        .expect(res => expect(res.body.message).to.contain('Result could not be calculated'))
        .end(done)
    });
  });
});
