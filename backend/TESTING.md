# Testing Guide

This document provides a comprehensive guide for running and understanding the test suite for the Personal Expense Tracker backend.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run All Tests
```bash
npm test
```

### 3. Run Tests with Coverage
```bash
npm run test:coverage
```

## Available Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode (re-runs on file changes) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:middleware` | Run only middleware tests |
| `npm run test:services` | Run only service tests |
| `npm run test:auth` | Run only authentication service tests |
| `npm run test:transactions` | Run only transaction service tests |
| `npm run test:validate` | Run only validation middleware tests |
| `npm run test:token` | Run only token verification tests |

## Test Structure

### Middleware Tests
- **validateRequest.test.js**: Tests the request validation middleware
  - Validates express-validator integration
  - Tests error message formatting
  - Covers both success and failure scenarios

- **verifyToken.test.js**: Tests the JWT token verification middleware
  - Tests missing authorization headers
  - Tests invalid token formats
  - Tests successful token verification
  - Tests error handling

### Service Tests
- **authService.test.js**: Tests authentication operations
  - User registration (signup)
  - User login
  - Password hashing with bcrypt
  - JWT token generation
  - Comprehensive error handling

- **transactionService.test.js**: Tests transaction operations
  - Transaction creation
  - Transaction retrieval by ID
  - Transaction listing with filters and pagination
  - Transaction updates
  - Transaction deletion (soft delete)

- **userService.test.js**: Placeholder for future user service tests

## Test Coverage

The test suite aims for high coverage across:
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## Mocking Strategy

All external dependencies are properly mocked:
- **bcryptjs**: For password hashing operations
- **jsonwebtoken**: For JWT token operations
- **mongoose models**: For database operations
- **Express response utilities**: For HTTP responses

## Test Utilities

The `tests/setup.js` file provides helpful utilities:
- `testUtils.createMockRequest()`: Create mock Express request objects
- `testUtils.createMockResponse()`: Create mock Express response objects
- `testUtils.createMockNext()`: Create mock Express next functions
- `testUtils.createMockUser()`: Create mock user data
- `testUtils.createMockTransaction()`: Create mock transaction data

## Writing New Tests

When adding new functionality, follow these guidelines:

1. **Create test files** with the naming convention `*.test.js`
2. **Place tests** in appropriate directories (`middleware/`, `services/`, etc.)
3. **Use test utilities** from `setup.js` for consistency
4. **Mock external dependencies** to isolate units under test
5. **Test both success and error scenarios**
6. **Follow the AAA pattern**: Arrange, Act, Assert

### Example Test Structure
```javascript
import { jest } from '@jest/globals';

describe('MyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('myFunction', () => {
    test('should handle success case', async () => {
      // Arrange
      const mockData = { /* test data */ };
      
      // Act
      const result = await myFunction(mockData);
      
      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should handle error case', async () => {
      // Arrange
      const invalidData = { /* invalid data */ };
      
      // Act & Assert
      await expect(myFunction(invalidData)).rejects.toThrow('Expected error');
    });
  });
});
```

## Continuous Integration

The test suite is designed to run in CI/CD environments:
- All tests are isolated and don't require external services
- Database operations are mocked
- Environment variables are set in `setup.js`
- Tests run quickly and reliably

## Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure all dependencies are installed with `npm install`
2. **Jest configuration issues**: Check that `package.json` has the correct Jest configuration
3. **Mock not working**: Ensure mocks are properly set up in `beforeEach` blocks
4. **Async test failures**: Make sure to use `async/await` or return promises in tests

### Debug Mode
Run tests with verbose output:
```bash
npm test -- --verbose
```

### Watch Mode
For development, use watch mode to automatically re-run tests:
```bash
npm run test:watch
```

## Coverage Reports

After running `npm run test:coverage`, you can find detailed coverage reports in:
- **Terminal output**: Summary of coverage metrics
- **HTML report**: `coverage/lcov-report/index.html` (open in browser)
- **LCOV file**: `coverage/lcov.info` (for CI/CD integration)

## Best Practices

1. **Keep tests focused**: Each test should verify one specific behavior
2. **Use descriptive names**: Test names should clearly indicate what is being tested
3. **Mock external dependencies**: Don't rely on external services in unit tests
4. **Test edge cases**: Include tests for error conditions and boundary values
5. **Maintain test data**: Use consistent mock data across tests
6. **Clean up**: Use `beforeEach` and `afterEach` to reset state between tests

## Contributing

When contributing to the test suite:
1. Ensure all new functionality has corresponding tests
2. Maintain or improve test coverage
3. Follow existing test patterns and conventions
4. Update this documentation if adding new test utilities or patterns
