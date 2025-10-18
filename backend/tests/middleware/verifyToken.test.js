import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../src/middleware/verifyToken.js';
import { unAuthorizedRequest } from '../../src/util/responses/clientErrorResponses.js';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

// Mock response utilities
jest.mock('../../src/util/responses/clientErrorResponses.js', () => ({
  unAuthorizedRequest: jest.fn()
}));

describe('verifyToken Middleware', () => {
  let mockReq, mockRes, mockNext;
  const originalEnv = process.env;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {};
    mockNext = jest.fn();
    
    // Set up environment variable
    process.env.JWT_SECRET_KEY = 'test-secret-key';
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('when authorization header is missing', () => {
    test('should return unauthorized when no authorization header', async () => {
      // Arrange
      mockReq.headers = {};
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

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
    test('should return unauthorized when token format is invalid (no space)', async () => {
      // Arrange
      mockReq.headers = { authorization: 'InvalidToken' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Invalid token format' }
      });
      expect(result).toBe('unauthorized response');
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return unauthorized when token format has more than 2 parts', async () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer token extra' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

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
    test('should return unauthorized when JWT verification throws error', async () => {
      // Arrange
      const mockToken = 'valid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });
      
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
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

    test('should return unauthorized when decoded token is null', async () => {
      // Arrange
      const mockToken = 'valid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, null);
      });
      
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
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
    test('should call next() when token is valid', async () => {
      // Arrange
      const mockToken = 'valid.jwt.token';
      const mockDecoded = {
        userId: 'user123',
        email: 'test@example.com'
      };
      
      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      // Act
      await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        'test-secret-key',
        expect.any(Function)
      );
      expect(mockReq.user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(unAuthorizedRequest).not.toHaveBeenCalled();
    });

    test('should attach decoded user data to request object', async () => {
      // Arrange
      const mockToken = 'valid.jwt.token';
      const mockDecoded = {
        userId: 'user456',
        email: 'user@example.com',
        role: 'admin'
      };
      
      mockReq.headers = { authorization: `Bearer ${mockToken}` };
      
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      // Act
      await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockReq.user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    test('should handle unexpected errors in try-catch block', async () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer token' };
      
      // Mock jwt.verify to throw an error
      jwt.verify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Error while verifying token' }
      });
      expect(result).toBe('unauthorized response');
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle missing JWT_SECRET_KEY environment variable', async () => {
      // Arrange
      delete process.env.JWT_SECRET_KEY;
      mockReq.headers = { authorization: 'Bearer token' };
      
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        'token',
        undefined,
        expect.any(Function)
      );
    });
  });

  describe('edge cases', () => {
    test('should handle empty authorization header', async () => {
      // Arrange
      mockReq.headers = { authorization: '' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Token not found' }
      });
    });

    test('should handle authorization header with only Bearer', async () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Invalid token format' }
      });
    });

    test('should handle authorization header with Bearer and empty token', async () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer ' };
      unAuthorizedRequest.mockReturnValue('unauthorized response');

      // Act
      const result = await verifyToken(mockReq, mockRes, mockNext);

      // Assert
      expect(unAuthorizedRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: { message: 'Invalid token format' }
      });
    });
  });
});
