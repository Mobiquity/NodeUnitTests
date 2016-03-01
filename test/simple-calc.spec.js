const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = request(require('./helpers').createTestApp());

describe('Calculator', () => {
  describe('GET /add', () => {
    it('adds values', done => app
      .get('/simple-calc/add')
      .query({leftOperand: 1, rightOperand: 2})
      .expect(200)
      .expect(res => expect(res.body.result).to.equal(3))
      .end(done)
    );

    it('prevents calculation on non-numbers', done => app
      .get('/simple-calc/add')
      .query({leftOperand: 10, rightOperand: 'not a number'})
      .expect(400)
      .expect(res => expect(res.body.message).to.contain('Both operands must be numbers'))
      .end(done)
    );
  });

  describe('GET /subtract', () => {
    it('subtracts values', done => app
      .get('/simple-calc/subtract')
      .query({leftOperand: 1, rightOperand: 2})
      .expect(200)
      .expect(res => expect(res.body.result).to.equal(-1))
      .end(done)
    );
  });

  describe('GET /multiply', () => {
    it('multiplies values', done => app
      .get('/simple-calc/multiply')
      .query({leftOperand: 2, rightOperand: 3})
      .expect(200)
      .expect(res => expect(res.body.result).to.equal(6))
      .end(done)
    );
  });

  describe('GET /divide', () => {
    it('divides values', done => app
      .get('/simple-calc/divide')
      .query({leftOperand: 10, rightOperand: 5})
      .expect(200)
      .expect(res => expect(res.body.result).to.equal(2))
      .end(done)
    );


    it('handles division by zero', done => app
      .get('/simple-calc/divide')
      .query({leftOperand: 10, rightOperand: 0})
      .expect(500)
      .expect(res => expect(res.body.message).to.contain('Division by zero'))
      .end(done)
    );
  });
});
