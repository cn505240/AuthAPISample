import chai from 'chai';
import request from 'supertest';
import Server from '../server';
import { generateAccessToken } from '../server/api/middleware/auth';
import { User } from '../server/db/db';

const expect = chai.expect;

const testToken = generateAccessToken('conor.mclaughlin@dal.ca');
const testUsers = [
  {
    email: 'conor.mclaughlin@dal.ca',
    passwordHash:
      '$2b$10$x57/qvjw5ZABLwQw0vl2newAACVz222sBHtCF7WzJDzxcQsiomxd.',
    firstName: 'Conor',
    lastName: 'McLaughlin',
  },
  {
    email: 'bizarro.conor@dal.ca',
    passwordHash: 'somethingOrOther',
    firstName: 'Connor',
    lastName: 'MacLauchlan',
  },
];

describe('Users', () => {
  before(async () => {
    // wipe users table - workaround not having set up a testing database or mock
    User.destroy({
      where: {},
      truncate: true,
    });

    await User.bulkCreate(testUsers);
  });
  after(() => {
    User.destroy({
      where: {},
      truncate: true,
    });
  });

  it('success - get users', (done) => {
    request(Server)
      .get('/users')
      .set('x-authentication-token', testToken)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.users.length).to.equal(2);
        done();
      });
  });

  it('success - update user', (done) => {
    request(Server)
      .put('/users')
      .set('x-authentication-token', testToken)
      .send({
        firstName: 'Testo',
        lastName: 'Testerson',
      })
      .end(async (error, response) => {
        expect(response.status).to.equal(200);

        // verify that we've updated the correct user
        const updatedUser = await User.findOne({
          where: {
            email: 'conor.mclaughlin@dal.ca',
          },
        });
        expect(updatedUser.firstName).to.equal('Testo');
        expect(updatedUser.lastName).to.equal('Testerson');
        done();
      });
  });
});
