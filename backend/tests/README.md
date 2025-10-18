# Test Suite Documentation

This directory contains comprehensive unit tests for the Personal Expense Tracker backend application.

## Test Structure

```
tests/
├── middleware/
│   ├── validateRequest.test.js    # Tests for request validation middleware
│   └── verifyToken.test.js        # Tests for JWT token verification middleware
├── services/
│   ├── authService.test.js        # Tests for authentication service
│   ├── transactionService.test.js # Tests for transaction service
│   └── userService.test.js        # Tests for user service (placeholder)
├── setup.js                       # Jest configuration and test utilities
└── README.md                      # This documentation file
```

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

## Test Coverage

The test suite covers:

### Middleware Tests
- **validateRequest.js**: Tests for express-validator integration
  - Valid request handling
  - Invalid request error formatting
  - Error message structure validation

- **verifyToken.js**: Tests for JWT authentication
  - Missing authorization header
  - Invalid token format
  - Token verification success/failure
  - User data attachment to request

### Service Tests
- **authService.js**: Tests for authentication operations
  - User registration (signup)
  - User login
  - Password hashing
  - JWT token generation
  - Error handling for various scenarios

- **transactionService.js**: Tests for transaction operations
  - Transaction creation
  - Transaction retrieval by ID
  - Transaction listing with filters and pagination
  - Transaction updates
  - Transaction deletion (soft delete)

- **userService.js**: Placeholder for future user service tests

## Test Utilities

The `setup.js` file provides global test utilities:

- `testUtils.createMockRequest()`: Creates mock Express request objects
- `testUtils.createMockResponse()`: Creates mock Express response objects
- `testUtils.createMockNext()`: Creates mock Express next functions
- `testUtils.createMockUser()`: Creates mock user data
- `testUtils.createMockTransaction()`: Creates mock transaction data

## Mocking Strategy

Tests use Jest mocking to isolate units under test:

- **External Dependencies**: All external libraries (bcryptjs, jsonwebtoken, mongoose) are mocked
- **Database Models**: Mongoose models are mocked to avoid database dependencies
- **Response Utilities**: Custom response functions are mocked
- **Environment Variables**: Test environment variables are set in setup.js

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: Tests cover both success and error scenarios
4. **Descriptive Names**: Test descriptions clearly indicate what is being tested
5. **Arrange-Act-Assert**: Tests follow the AAA pattern for clarity

## Adding New Tests

When adding new functionality:

1. Create test files following the naming convention: `*.test.js`
2. Place tests in appropriate directories (middleware/, services/, etc.)
3. Use the provided test utilities from `setup.js`
4. Mock external dependencies appropriately
5. Test both success and error scenarios
6. Update this documentation if needed

## Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

Run `npm run test:coverage` to see current coverage metrics.
