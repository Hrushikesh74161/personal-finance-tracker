import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signup, login } from '../../src/services/authService.js';
import { userModel } from '../../src/models/userModel.js';

// Mock bcryptjs
jest.mock('bcryptjs');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

// Mock userModel
jest.mock('../../src/models/userModel.js', () => ({
  userModel: {
    findOne: jest.fn(),
    prototype: {
      save: jest.fn()
    }
  }
}));

describe('AuthService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env.JWT_SECRET_KEY = 'test-secret-key';
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('signup', () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    };

    const mockSavedUser = {
      _id: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword123',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };

    test('should successfully create a new user', async () => {
      // Arrange
      userModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      
      const mockNewUser = {
        ...mockUserData,
        password: 'hashedPassword123',
        save: jest.fn().mockResolvedValue(mockSavedUser)
      };
      
      // Mock the constructor
      const UserConstructor = jest.fn().mockImplementation(() => mockNewUser);
      userModel.mockImplementation(UserConstructor);

      // Act
      const result = await signup(mockUserData);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        deleted: false
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(UserConstructor).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword123'
      });
      expect(mockNewUser.save).toHaveBeenCalled();
      
      expect(result).toEqual({
        id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        createdAt: mockSavedUser.createdAt,
        updatedAt: mockSavedUser.updatedAt
      });
    });

    test('should throw error when user already exists', async () => {
      // Arrange
      const existingUser = { _id: 'existing123', email: 'john.doe@example.com' };
      userModel.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(signup(mockUserData)).rejects.toThrow('User with this email already exists');
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        deleted: false
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test('should handle bcrypt hash error', async () => {
      // Arrange
      userModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error('Hash error'));

      // Act & Assert
      await expect(signup(mockUserData)).rejects.toThrow('Hash error');
    });

    test('should handle user save error', async () => {
      // Arrange
      userModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      
      const mockNewUser = {
        ...mockUserData,
        password: 'hashedPassword123',
        save: jest.fn().mockRejectedValue(new Error('Save error'))
      };
      
      const UserConstructor = jest.fn().mockImplementation(() => mockNewUser);
      userModel.mockImplementation(UserConstructor);

      // Act & Assert
      await expect(signup(mockUserData)).rejects.toThrow('Save error');
    });
  });

  describe('login', () => {
    const mockLoginData = {
      email: 'john.doe@example.com',
      password: 'password123'
    };

    const mockUser = {
      _id: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword123',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };

    test('should successfully login with valid credentials', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token-123');

      // Act
      const result = await login(mockLoginData);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        deleted: false
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: 'user123',
          email: 'john.doe@example.com'
        },
        'test-secret-key',
        { expiresIn: '24h' }
      );

      expect(result).toEqual({
        user: {
          id: 'user123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt
        },
        token: 'jwt-token-123'
      });
    });

    test('should throw error when user not found', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('Invalid email or password');
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        deleted: false
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('should throw error when password is invalid', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('Invalid email or password');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('should use default JWT secret when environment variable is not set', async () => {
      // Arrange
      delete process.env.JWT_SECRET_KEY;
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token-123');

      // Act
      await login(mockLoginData);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: 'user123',
          email: 'john.doe@example.com'
        },
        'your-secret-key',
        { expiresIn: '24h' }
      );
    });

    test('should handle bcrypt compare error', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockRejectedValue(new Error('Compare error'));

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('Compare error');
    });

    test('should handle jwt sign error', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error('JWT sign error');
      });

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('JWT sign error');
    });

    test('should handle database query error', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('Database error');
    });
  });
});
