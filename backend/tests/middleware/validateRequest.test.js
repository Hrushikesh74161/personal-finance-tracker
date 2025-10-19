import { jest } from "@jest/globals";

jest.unstable_mockModule('express-validator', () => {
  return {
    validationResult: jest.fn(),
    __esModule: true,
  };
});

jest.unstable_mockModule('../src/util/responses/clientErrorResponses.js', () => {
  return {
    badRequest: jest.fn(),
    __esModule: true,
  };
});

const { validationResult } = await import('express-validator');
const { validateRequest } = await import('../../src/middleware/validateRequest.js');
const { badRequest } = await import('../../src/util/responses/clientErrorResponses.js');

describe('validateRequest Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = testUtils.createMockRequest();
    mockRes = testUtils.createMockResponse();
    mockNext = testUtils.createMockNext();

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('when validation passes', () => {
    it('should call next() when no validation errors', () => {
      // Arrange
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });

      // Act
      validateRequest(mockReq, mockRes, mockNext);

      // Assert
      expect(validationResult).toHaveBeenCalledWith(mockReq);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(badRequest).not.toHaveBeenCalled();
    });
  });

  describe('when validation fails', () => {
    it('should return bad request when validation errors exist', () => {
      // Arrange
      const mockErrors = [
        {
          path: 'email',
          param: 'email',
          msg: 'Email is required',
          value: ''
        },
        {
          path: 'password',
          param: 'password',
          msg: 'Password must be at least 6 characters',
          value: '123'
        }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      const expectedErrorResponse = {
        error: {
          message: 'Validation failed',
          details: [
            {
              field: 'email',
              message: 'Email is required',
              value: ''
            },
            {
              field: 'password',
              message: 'Password must be at least 6 characters',
              value: '123'
            }
          ]
        }
      };

      badRequest.mockReturnValue('bad request response');

      // Act
      const result = validateRequest(mockReq, mockRes, mockNext);

      // Assert
      expect(validationResult).toHaveBeenCalledWith(mockReq);
      expect(badRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: expectedErrorResponse.error
      });
      expect(result).toBe('bad request response');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors with path property', () => {
      // Arrange
      const mockErrors = [
        {
          path: 'firstName',
          msg: 'First name is required',
          value: undefined
        }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      // Act
      validateRequest(mockReq, mockRes, mockNext);

      // Assert
      expect(badRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: {
          message: 'Validation failed',
          details: [
            {
              field: 'firstName',
              message: 'First name is required',
              value: undefined
            }
          ]
        }
      });
    });

    it('should handle errors with param property when path is not available', () => {
      // Arrange
      const mockErrors = [
        {
          param: 'lastName',
          msg: 'Last name is required',
          value: null
        }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      // Act
      validateRequest(mockReq, mockRes, mockNext);

      // Assert
      expect(badRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: {
          message: 'Validation failed',
          details: [
            {
              field: 'lastName',
              message: 'Last name is required',
              value: null
            }
          ]
        }
      });
    });

    it('should handle empty errors array', () => {
      // Arrange
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => []
      });

      // Act
      validateRequest(mockReq, mockRes, mockNext);

      // Assert
      expect(badRequest).toHaveBeenCalledWith({
        res: mockRes,
        error: {
          message: 'Validation failed',
          details: []
        }
      });
    });
  });

  describe('error handling', () => {
    it('should handle validationResult throwing an error', () => {
      // Arrange
      validationResult.mockImplementation(() => {
        throw new Error('Validation result error');
      });

      // Act & Assert
      expect(() => {
        validateRequest(mockReq, mockRes, mockNext);
      }).toThrow('Validation result error');
    });
  });
});
