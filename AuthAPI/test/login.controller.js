import chai from 'chai';
import spies from 'chai-spies';
import request from 'supertest';
import Server from '../server';
import { User } from '../server/db/db';

const bcrypt = require('bcrypt');

const expect = chai.expect;
chai.use(spies);

describe('Login', () => {
  const sandbox = chai.spy.sandbox();

  before(() => {
    // wipe users table - workaround not having set up a testing database or mock
    User.destroy({
      where: {},
      truncate: true,
    });

    User.create({
      email: 'conor.mclaughlin@dal.ca',
      passwordHash:
        '$2b$10$x57/qvjw5ZABLwQw0vl2newAACVz222sBHtCF7WzJDzxcQsiomxd.',
      firstName: 'Conor',
      lastName: 'McLaughlin',
    });
  });
  beforeEach(() => {
    sandbox.restore();
  });

  after(() => {
    User.destroy({
      where: {},
      truncate: true,
    });
  });

  it('error - email not an email', (done) => {
    request(Server)
      .post('/login')
      .send({
        email: "This ain't an email address",
        password: 'abcdefghijklmnopqrsruvwxyz',
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.details[0].message).to.equal(
          '"email" must be a valid email'
        );
        done();
      });
  });

  it('error - missing fields', (done) => {
    request(Server)
      .post('/login')
      .send({
        email: 'conor.mclaughlin@dal.ca',
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.details[0].message).to.equal(
          '"password" is required'
        );
        done();
      });
  });

  it('error - incorrect password', (done) => {
    request(Server)
      .post('/login')
      .send({
        email: 'conor.mclaughlin@dal.ca',
        password: 'some_wrong_password',
      })
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('User not found');
        done();
      });
  });

  it('successful login', (done) => {
    sandbox.on(bcrypt, 'genSalt', () => {
      return '$2b$10$x57/qvjw5ZABLwQw0vl2ne';
    });
    request(Server)
      .post('/login')
      .send({
        email: 'conor.mclaughlin@dal.ca',
        password: 'the_actual_password',
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.token.length).to.be.greaterThan(0);
        done();
      });
  });
});
