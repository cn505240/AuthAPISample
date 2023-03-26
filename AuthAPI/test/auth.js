import chai from 'chai';
import spies from 'chai-spies';
import {
  generateAccessToken,
  authenticateRequest,
} from '../server/api/middleware/auth';

const jwt = require('jsonwebtoken');
const expect = chai.expect;

describe('Auth', () => {
  before(() => {
    chai.use(spies);
  });
  describe('generateAccessToken', () => {
    it('successful', () => {
      const token = generateAccessToken('username');

      // assert we're generating a token - trust that the JWT library is well tested
      expect(typeof token === 'string').to.be.true;
      expect(token.length).to.be.greaterThan(0);
    });
  });

  describe('authenticateToken', () => {
    let mockRequest, mockResponse, mockSendStatus, mockCallback, sandbox;
    before(() => {
      sandbox = chai.spy.sandbox();
    });
    beforeEach(() => {
      mockRequest = {
        headers: {
          'x-authentication-token':
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
      };
      mockSendStatus = chai.spy();
      mockResponse = {
        sendStatus: mockSendStatus,
      };
      mockCallback = chai.spy();
    });
    afterEach(() => {
      // remove our sandbox spies so they're not persisting between tests
      sandbox.restore();
    });

    it('error - no token raises 401', async () => {
      mockRequest.headers = {};
      await authenticateRequest(mockRequest, mockResponse, mockCallback);
      expect(mockSendStatus).to.have.been.called.with(401);
    });

    it('error - token validation error raises 403', async () => {
      // mock JWT verification function to throw an error
      sandbox.on(jwt, 'verify', () => {
        throw Error('something went wrong');
      });

      await authenticateRequest(mockRequest, mockResponse, mockCallback);
      expect(mockSendStatus).to.have.been.called.with(403);
    });

    it('success - sets request user and calls callback function', async () => {
      sandbox.on(jwt, 'verify', () => ({ username: 'username' }));
      await authenticateRequest(mockRequest, mockResponse, mockCallback);
      expect(mockCallback).to.have.been.called.once;
    });
  });
});
