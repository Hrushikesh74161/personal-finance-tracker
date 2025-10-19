import { jest } from "@jest/globals";

// bcrypt mock
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
  __esModule: true,
}))

// jsonwebtoken mock
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
  },
  __esModule: true,
}))

// userModel mock
jest.unstable_mockModule('../src/models/userModel.js', () => {
  const mockUserModel = jest.fn();
  mockUserModel.findOne = jest.fn();

  return {
    userModel: mockUserModel,
    __esModule: true,
  };
});

const bcrypt = await import('bcryptjs');
const jwt = await import('jsonwebtoken');
const { userModel } = await import('../../src/models/userModel.js');
const { login, signup } = await import('../../src/services/authService.js');


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

    it('should successfully create a new user', async () => {
      // Arrange
      userModel.findOne.mockResolvedValue(null);
      bcrypt.default.hash.mockResolvedValue('hashedPassword123');

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
      expect(bcrypt.default.hash).toHaveBeenCalledWith('password123', 12);
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

    it('should throw error when user already exists', async () => {
      // Arrange
      const existingUser = { _id: 'existing123', email: 'john.doe@example.com' };
      userModel.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(signup(mockUserData)).rejects.toThrow('User with this email already exists');
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        deleted: false
      });
      expect(bcrypt.default.hash).not.toHaveBeenCalled();
    });

    it('should handle bcrypt hash error', async () => {
      // Arrange
      userModel.findOne.mockResolvedValue(null);
      bcrypt.default.hash.mockRejectedValue(new Error('Hash error'));

      // Act & Assert
      await expect(signup(mockUserData)).rejects.toThrow('Hash error');
    });

    it('should handle user save error', async () => {
      // Arrange
      userModel.findOne.mockResolvedValue(null);
      bcrypt.default.hash.mockResolvedValue('hashedPassword123');

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

    it('should successfully login with valid credentials', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.default.compare.mockResolvedValue(true);
      jwt.default.sign.mockReturnValue('jwt-token-123');

      // Act
      const result = await login(mockLoginData);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        deleted: false
      });
      expect(bcrypt.default.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(jwt.default.sign).toHaveBeenCalledWith(
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

    it('should throw error when user not found', async () => {
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
      expect(bcrypt.default.compare).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.default.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('Invalid email or password');
      expect(bcrypt.default.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(jwt.default.sign).not.toHaveBeenCalled();
    });

    it('should use default JWT secret when environment variable is not set', async () => {
      // Arrange
      delete process.env.JWT_SECRET_KEY;
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.default.compare.mockResolvedValue(true);
      jwt.default.sign.mockReturnValue('jwt-token-123');

      // Act
      await login(mockLoginData);

      // Assert
      expect(jwt.default.sign).toHaveBeenCalledWith(
        {
          userId: 'user123',
          email: 'john.doe@example.com'
        },
        'your-secret-key',
        { expiresIn: '24h' }
      );
    });

    it('should handle bcrypt compare error', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.default.compare.mockRejectedValue(new Error('Compare error'));

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('Compare error');
    });

    it('should handle jwt sign error', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.default.compare.mockResolvedValue(true);
      jwt.default.sign.mockImplementation(() => {
        throw new Error('JWT sign error');
      });

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('JWT sign error');
    });

    it('should handle database query error', async () => {
      // Arrange
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      // Act & Assert
      await expect(login(mockLoginData)).rejects.toThrow('Database error');
    });
  });
});
