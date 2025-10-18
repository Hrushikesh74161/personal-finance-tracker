# Accounts API Documentation

This document describes the Accounts API endpoints for the Personal Finance Tracker application.

## Base URL
All endpoints are prefixed with `/api/accounts`

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Account
**POST** `/api/accounts`

Creates a new account for the authenticated user.

#### Request Body
```json
{
  "name": "My Checking Account",
  "type": "checking",
  "balance": 1000.50,
  "description": "Primary checking account",
  "accountNumber": "1234567890"
}
```

#### Required Fields
- `name`: Account name (1-256 characters)
- `type`: Account type (checking, savings, creditCard, cash, other)

#### Optional Fields
- `balance`: Initial balance (default: 0)
- `description`: Account description (max 500 characters)
- `accountNumber`: Account number (max 50 characters)

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "account_id",
    "userId": "user_id",
    "name": "My Checking Account",
    "type": "checking",
    "balance": 1000.50,
    "description": "Primary checking account",
    "accountNumber": "1234567890",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Accounts
**GET** `/api/accounts`

Retrieves all accounts for the authenticated user with optional filtering and pagination.

#### Query Parameters
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 10, min: 1, max: 100)
- `type`: Filter by account type
- `isActive`: Filter by active status (true/false)
- `minBalance`: Minimum balance filter
- `maxBalance`: Maximum balance filter
- `sortBy`: Sort field (name, type, balance, createdAt, updatedAt)
- `sortOrder`: Sort order (asc/desc)

#### Example Request
```
GET /api/accounts?type=checking&isActive=true&page=1&limit=10&sortBy=name&sortOrder=asc
```

#### Response
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "_id": "account_id",
        "userId": "user_id",
        "name": "My Checking Account",
        "type": "checking",
        "balance": 1000.50,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 1,
      "limit": 10
    }
  }
}
```

### 3. Get Account by ID
**GET** `/api/accounts/:id`

Retrieves a specific account by its ID.

#### Path Parameters
- `id`: Account ID (MongoDB ObjectId)

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "account_id",
    "userId": "user_id",
    "name": "My Checking Account",
    "type": "checking",
    "balance": 1000.50,
    "description": "Primary checking account",
    "accountNumber": "1234567890",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Account
**PATCH** `/api/accounts/:id`

Updates an existing account.

#### Path Parameters
- `id`: Account ID (MongoDB ObjectId)

#### Request Body
Same as create account, but all fields are optional.

#### Example Request
```json
{
  "balance": 1500.75,
  "description": "Updated description"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "account_id",
    "userId": "user_id",
    "name": "My Checking Account",
    "type": "checking",
    "balance": 1500.75,
    "description": "Updated description",
    "accountNumber": "1234567890",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

### 5. Delete Account
**DELETE** `/api/accounts/:id`

Soft deletes an account (marks as deleted but doesn't remove from database).

#### Path Parameters
- `id`: Account ID (MongoDB ObjectId)

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Account deleted successfully"
  }
}
```

### 6. Get Account Balance Summary
**GET** `/api/accounts/summary`

Retrieves a summary of all account balances grouped by type.

#### Response
```json
{
  "success": true,
  "data": {
    "totalBalance": 5000.25,
    "byType": {
      "checking": {
        "count": 2,
        "totalBalance": 3000.50,
        "accounts": [...]
      },
      "savings": {
        "count": 1,
        "totalBalance": 1999.75,
        "accounts": [...]
      }
    },
    "accounts": [...]
  }
}
```

## Account Types

The following account types are supported:

- `checking`: Checking accounts
- `savings`: Savings accounts
- `creditCard`: Credit card accounts
- `cash`: Cash accounts
- `other`: Other types of accounts

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Account not found
- `500 Internal Server Error`: Server errors

#### Example Error Response
```json
{
  "success": false,
  "error": {
    "message": "Account not found"
  }
}
```
