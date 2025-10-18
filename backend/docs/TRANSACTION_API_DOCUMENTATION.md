# Transaction API Documentation

This document provides comprehensive documentation for the Transaction API endpoints in the Personal Expense Tracker application.

## Base URL
```
/api/transactions
```

## Authentication
All transaction endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Transaction Model

### Transaction Types
- `expense` - Money going out (purchases, bills, etc.)
- `income` - Money coming in (salary, freelance, etc.)
- `transfer` - Money movement between accounts
- `adjustment` - Manual adjustments to balance

### Transaction Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  type: String, // "expense" | "income" | "transfer" | "adjustment"
  categoryId: ObjectId, // Reference to Category
  amount: Number, // Transaction amount (>= 0)
  description: String, // Transaction description
  date: Date, // Transaction date
  tags: [String], // Optional tags (max 10)
  accountId: ObjectId, // Reference to Account
  deleted: Boolean, // Soft delete flag
  deletedAt: Date, // Soft delete timestamp
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### 1. Create Transaction

**Endpoint:** `POST /api/transactions`

**Description:** Create a new transaction

**Request Body:**
```json
{
  "type": "expense",
  "categoryId": "65a1b2c3d4e5f6789012348",
  "amount": 25.50,
  "description": "Lunch at restaurant",
  "date": "2024-01-15T12:30:00.000Z",
  "tags": ["lunch", "restaurant"],
  "accountId": "65a1b2c3d4e5f6789012347"
}
```

**Validation Rules:**
- `type`: Required, must be one of: "expense", "income", "transfer", "adjustment"
- `categoryId`: Required, must be valid MongoDB ObjectId referencing an existing category
- `amount`: Required, must be a number >= 0
- `description`: Required, 1-500 characters
- `date`: Optional, must be valid ISO 8601 date format
- `tags`: Optional array, max 10 tags, each 1-50 characters
- `accountId`: Required, must be valid MongoDB ObjectId

**Response:**
```json
{
  "status": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "userId": {
      "_id": "65a1b2c3d4e5f6789012346",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "type": "expense",
    "category": "Food & Dining",
    "amount": 25.50,
    "description": "Lunch at restaurant",
    "date": "2024-01-15T12:30:00.000Z",
    "tags": ["lunch", "restaurant"],
    "accountId": {
      "_id": "65a1b2c3d4e5f6789012347",
      "name": "Checking Account",
      "type": "checking",
      "balance": 1500.00
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 2. Get All Transactions

**Endpoint:** `GET /api/transactions`

**Description:** Get all transactions with optional filtering and pagination

**Query Parameters:**
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 10, min: 1, max: 100)
- `type` (optional): Filter by transaction type
- `categoryId` (optional): Filter by category ID
- `accountId` (optional): Filter by account ID
- `startDate` (optional): Filter transactions from this date (ISO 8601)
- `endDate` (optional): Filter transactions until this date (ISO 8601)
- `minAmount` (optional): Minimum amount filter
- `maxAmount` (optional): Maximum amount filter
- `sortBy` (optional): Sort field ("date", "amount", "createdAt", "updatedAt")
- `sortOrder` (optional): Sort order ("asc" or "desc")

**Example Request:**
```
GET /api/transactions?page=1&limit=20&type=expense&categoryId=65a1b2c3d4e5f6789012348&accountId=65a1b2c3d4e5f6789012347&startDate=2024-01-01&endDate=2024-01-31&sortBy=date&sortOrder=desc
```

**Response:**
```json
{
  "status": true,
  "data": {
    "transactions": [
      {
        "_id": "65a1b2c3d4e5f6789012345",
        "userId": {
          "_id": "65a1b2c3d4e5f6789012346",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "type": "expense",
        "categoryId": {
          "_id": "65a1b2c3d4e5f6789012348",
          "name": "Food & Dining",
          "description": "Expenses related to food and dining",
          "color": "#f59e0b",
          "icon": "restaurant"
        },
        "amount": 25.50,
        "description": "Lunch at restaurant",
        "date": "2024-01-15T12:30:00.000Z",
        "tags": ["lunch", "restaurant"],
        "accountId": {
          "_id": "65a1b2c3d4e5f6789012347",
          "name": "Checking Account",
          "type": "checking",
          "balance": 1500.00
        },
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 100,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 20
    }
  }
}
```

---

### 3. Get Transaction by ID

**Endpoint:** `GET /api/transactions/:id`

**Description:** Get a specific transaction by its ID

**Path Parameters:**
- `id`: Transaction ID (MongoDB ObjectId)

**Response:**
```json
{
  "status": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "userId": {
      "_id": "65a1b2c3d4e5f6789012346",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "type": "expense",
    "category": "Food & Dining",
    "amount": 25.50,
    "description": "Lunch at restaurant",
    "date": "2024-01-15T12:30:00.000Z",
    "tags": ["lunch", "restaurant"],
    "accountId": {
      "_id": "65a1b2c3d4e5f6789012347",
      "name": "Checking Account",
      "type": "checking",
      "balance": 1500.00
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 4. Update Transaction

**Endpoint:** `PATCH /api/transactions/:id`

**Description:** Update a specific transaction

**Path Parameters:**
- `id`: Transaction ID (MongoDB ObjectId)

**Request Body:** (All fields optional)
```json
{
  "type": "expense",
  "categoryId": "65a1b2c3d4e5f6789012348",
  "amount": 30.00,
  "description": "Updated lunch description",
  "date": "2024-01-15T12:30:00.000Z",
  "tags": ["lunch", "restaurant", "updated"],
  "accountId": "65a1b2c3d4e5f6789012347"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "userId": {
      "_id": "65a1b2c3d4e5f6789012346",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "type": "expense",
    "category": "Food & Dining",
    "amount": 30.00,
    "description": "Updated lunch description",
    "date": "2024-01-15T12:30:00.000Z",
    "tags": ["lunch", "restaurant", "updated"],
    "accountId": {
      "_id": "65a1b2c3d4e5f6789012347",
      "name": "Checking Account",
      "type": "checking",
      "balance": 1500.00
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 5. Delete Transaction

**Endpoint:** `DELETE /api/transactions/:id`

**Description:** Soft delete a specific transaction

**Path Parameters:**
- `id`: Transaction ID (MongoDB ObjectId)

**Response:**
```json
{
  "status": true,
  "data": {
    "message": "Transaction deleted successfully"
  }
}
```

---