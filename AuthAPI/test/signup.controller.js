import chai from 'chai';
import request from 'supertest';
import Server from '../server';
import { User } from '../server/db/db';

const expect = chai.expect;

describe('Signup', () => {
  before(() => {
    // wipe users table - workaround not having set up a testing database or mock
    User.destroy({
      where: {},
      truncate: true,
    });
  });
  after(() => {
    User.destroy({
      where: {},
      truncate: true,
    });
  });

  it('error - email not an email', (done) => {
    request(Server)
      .post('/signup')
      .send({
        email: "This ain't an email address",
        password: 'conor',
        firstName: 'Conor123',
        lastName: 'McLaughlin',
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
      .post('/signup')
      .send({
        email: 'conor.mclaughlin@dal.ca',
        firstName: 'Conor',
        lastName: 'McLaughlin',
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.details[0].message).to.equal(
          '"password" is required'
        );
        done();
      });
  });

  it('success - user is created, token returned', (done) => {
    request(Server)
      .post('/signup')
      .send({
        email: 'conor.mclaughlin@dal.ca',
        password: 'abcdefghijklmnop',
        firstName: 'Conor',
        lastName: 'McLaughlin',
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.token.length).to.be.greaterThan(0);
        done();
      });
  });
});
