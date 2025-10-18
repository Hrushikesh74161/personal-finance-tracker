// Test setup file for Jest configuration
// This file helps configure Jest for ES modules and provides global test utilities

// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET_KEY = 'test-jwt-secret-key';

// Global test utilities can be added here
global.testUtils = {
  // Helper function to create mock request objects
  createMockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides
  }),

  // Helper function to create mock response objects
  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },

  // Helper function to create mock next function
  createMockNext: () => jest.fn(),

  // Helper function to create mock user data
  createMockUser: (overrides = {}) => ({
    _id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    deleted: false,
    ...overrides
  }),

  // Helper function to create mock transaction data
  createMockTransaction: (overrides = {}) => ({
    _id: 'transaction123',
    userId: 'user123',
    type: 'expense',
    category: 'Food',
    amount: 25.50,
    description: 'Lunch at restaurant',
    date: new Date('2023-01-15'),
    tags: ['food', 'lunch'],
    relatedTransactionId: null,
    paymentMethod: 'credit_card',
    location: 'Restaurant ABC',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    deleted: false,
    ...overrides
  })
};

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
