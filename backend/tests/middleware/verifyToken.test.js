import { jest } from "@jest/globals";

// Mock jsonwebtoken
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
  },
  // verify: jest.fn(),
  __esModule: true,
}))

// Mock response utilities
jest.unstable_mockModule('../src/util/responses/clientErrorResponses.js', () => ({
  unAuthorizedRequest: jest.fn(),
  __esModule: true,
}));

const jwt = await import('jsonwebtoken');
const { verifyToken } = await import('../../src/middleware/verifyToken.js');
const { unAuthorizedRequest } = await import('../../src/util/responses/clientErrorResponses.js');


describe('verifyToken Middleware', () => {
  let mockReq, mockRes, mockNext;
  const originalEnv = process.env;

  beforeEach(() => {
    mockReq = testUtils.createMockRequest();
    mockRes = testUtils.createMockResponse();
    mockNext = testUtils.createMockNext();

    // Set up environment variable
    process.env.JWT_SECRET_KEY = 'test-secret-key';

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('when authorization header is missing', () => {
    it('should return unauthorized when no authorization header', async () => {
      // Arrange
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Token not found' }
      });
      expect(result).toBe('unauthorized response');
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('when authorization header format is invalid', () => {
    it('should return unauthorized when token format is invalid (no space)', async () => {
      // Arrange
      mockReq.headers = { authorization: 'InvalidToken' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Invalid token format' }
      });
      expect(result).toBe('unauthorized response');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return unauthorized when token format has more than 2 parts', async () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer token extra' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Invalid token format' }
      });
      expect(result).toBe('unauthorized response');
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('when JWT verification fails', () => {
    it('should return unauthorized when JWT verification throws error', async () => {
      // Arrange
      const mockToken = 'valid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${mockToken}` };

      jwt.default.verify.mockImplementationOnce((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await new Promise(resolve => {
        verifyToken(mockReq, mockRes, mockNext);
        // Use a short delay to ensure the asynchronous jwt.verify callback completes
        setTimeout(() => {
          // Resolve the promise with the mock's return value from its call history
          resolve(unAuthorizedRequest.mock.results[0]?.value);
        }, 0);
      });

      // Assert
      expect(jwt.default.verify).toHaveBeenCalledWith(
        mockToken,
        'test-secret-key',
        expect.any(Function)
      );
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Error while parsing token' }
      });
      expect(result).toBe('unauthorized response');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return unauthorized when decoded token is null', async () => {
      // Arrange
      const mockToken = 'valid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${mockToken}` };

      jwt.default.verify.mockImplementation((token, secret, callback) => {
        callback(null, null);
      });

      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await new Promise(resolve => {
        verifyToken(mockReq, mockRes, mockNext);
        setTimeout(() => {
          resolve(unAuthorizedRequest.mock.results[0]?.value);
        }, 0);
      })

      // Assert
      expect(jwt.default.verify).toHaveBeenCalledWith(
        mockToken,
        'test-secret-key',
        expect.any(Function)
      );
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Cannot decode token' }
      });
      expect(result).toBe('unauthorized response');
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('when JWT verification succeeds', () => {
    it('should call next() when token is valid', async () => {
      // Arrange
      const mockToken = 'valid.jwt.token';
      const mockDecoded = {
        userId: 'user123',
        email: 'test@example.com'
      };

      mockReq.headers = { authorization: `Bearer ${mockToken}` };

      jwt.default.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      // Act
      verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(jwt.default.verify).toHaveBeenCalledWith(
        mockToken,
        'test-secret-key',
        expect.any(Function)
      );
      expect(mockReq.user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(unAuthorizedRequest).not.toHaveBeenCalled();
    });

    it('should attach decoded user data to request object', async () => {
      // Arrange
      const mockToken = 'valid.jwt.token';
      const mockDecoded = {
        userId: 'user456',
        email: 'user@example.com',
        role: 'admin'
      };

      mockReq.headers = { authorization: `Bearer ${mockToken}` };

      jwt.default.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      // Act
      verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockReq.user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should handle unexpected errors in try-catch block', async () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer token' };

      // Mock jwt.default.verify to throw an error
      jwt.default.verify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Error while verifying token' }
      });
      expect(result).toBe('unauthorized response');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing JWT_SECRET_KEY environment variable', async () => {
      // Arrange
      delete process.env.JWT_SECRET_KEY;
      mockReq.headers = { authorization: 'Bearer token' };

      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(jwt.default.verify).toHaveBeenCalledWith(
        'token',
        undefined,
        expect.any(Function)
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty authorization header', async () => {
      // Arrange
      mockReq.headers = { authorization: '' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Token not found' }
      });
    });

    it('should handle authorization header with only Bearer', async () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Invalid token format' }
      });
    });

    it('should handle authorization header with Bearer and empty token', async () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Invalid token format' }
      });
    });
  });
});
