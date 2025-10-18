# Budget API Documentation

This document describes the Budget API endpoints for the Personal Finance Tracker application.

## Base URL
```
/api/budgets
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Budget
**POST** `/api/budgets`

Creates a new budget for a specific category.

#### Request Body
```json
{
  "categoryId": "string (required)",
  "name": "string (required, 1-100 characters)",
  "description": "string (optional, max 500 characters)",
  "amount": "number (required, positive)",
  "period": "string (optional, enum: weekly|monthly|quarterly|yearly, default: monthly)",
  "startDate": "string (required, ISO 8601 date)",
  "endDate": "string (required, ISO 8601 date)"
}
```

#### Example Request
```json
{
  "categoryId": "64a1b2c3d4e5f6789012345a",
  "name": "Monthly Food Budget",
  "description": "Budget for groceries and dining out",
  "amount": 500,
  "period": "monthly",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345b",
    "userId": "64a1b2c3d4e5f6789012345c",
    "categoryId": {
      "_id": "64a1b2c3d4e5f6789012345a",
      "name": "Food",
      "color": "#FF5733",
      "icon": "restaurant"
    },
    "name": "Monthly Food Budget",
    "description": "Budget for groceries and dining out",
    "amount": 500,
    "period": "monthly",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.999Z",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 2. Get All Budgets
**GET** `/api/budgets`

Retrieves all budgets for the authenticated user with optional filtering and pagination.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `isActive` (optional): Filter by active status (boolean)
- `categoryId` (optional): Filter by category ID
- `period` (optional): Filter by period (weekly|monthly|quarterly|yearly)
- `search` (optional): Search term for name/description
- `sortBy` (optional): Sort field (name|amount|period|startDate|endDate|createdAt|updatedAt)
- `sortOrder` (optional): Sort order (asc|desc)

#### Example Request
```
GET /api/budgets?page=1&limit=10&isActive=true&period=monthly&sortBy=createdAt&sortOrder=desc
```

#### Response
```json
{
  "success": true,
  "data": {
    "budgets": [
      {
        "_id": "64a1b2c3d4e5f6789012345b",
        "userId": "64a1b2c3d4e5f6789012345c",
        "categoryId": {
          "_id": "64a1b2c3d4e5f6789012345a",
          "name": "Food",
          "color": "#FF5733",
          "icon": "restaurant"
        },
        "name": "Monthly Food Budget",
        "description": "Budget for groceries and dining out",
        "amount": 500,
        "period": "monthly",
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-01-31T23:59:59.999Z",
        "isActive": true,
        "deleted": false,
        "deletedAt": null,
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
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

### 3. Get Budget by ID
**GET** `/api/budgets/:id`

Retrieves a specific budget by its ID.

#### Path Parameters
- `id`: Budget ID (MongoDB ObjectId)

#### Example Request
```
GET /api/budgets/64a1b2c3d4e5f6789012345b
```

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345b",
    "userId": "64a1b2c3d4e5f6789012345c",
    "categoryId": {
      "_id": "64a1b2c3d4e5f6789012345a",
      "name": "Food",
      "color": "#FF5733",
      "icon": "restaurant"
    },
    "name": "Monthly Food Budget",
    "description": "Budget for groceries and dining out",
    "amount": 500,
    "period": "monthly",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.999Z",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 4. Update Budget
**PATCH** `/api/budgets/:id`

Updates an existing budget.

#### Path Parameters
- `id`: Budget ID (MongoDB ObjectId)

#### Request Body
```json
{
  "categoryId": "string (optional)",
  "name": "string (optional, 1-100 characters)",
  "description": "string (optional, max 500 characters)",
  "amount": "number (optional, positive)",
  "period": "string (optional, enum: weekly|monthly|quarterly|yearly)",
  "startDate": "string (optional, ISO 8601 date)",
  "endDate": "string (optional, ISO 8601 date)",
  "isActive": "boolean (optional)"
}
```

#### Example Request
```json
{
  "name": "Updated Food Budget",
  "amount": 600,
  "description": "Updated budget with increased amount"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345b",
    "userId": "64a1b2c3d4e5f6789012345c",
    "categoryId": {
      "_id": "64a1b2c3d4e5f6789012345a",
      "name": "Food",
      "color": "#FF5733",
      "icon": "restaurant"
    },
    "name": "Updated Food Budget",
    "description": "Updated budget with increased amount",
    "amount": 600,
    "period": "monthly",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.999Z",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T11:00:00.000Z"
  }
}
```

### 5. Delete Budget
**DELETE** `/api/budgets/:id`

Soft deletes a budget (marks as deleted but doesn't remove from database).

#### Path Parameters
- `id`: Budget ID (MongoDB ObjectId)

#### Example Request
```
DELETE /api/budgets/64a1b2c3d4e5f6789012345b
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Budget deleted successfully"
  }
}
```

### 6. Get Budget Statistics
**GET** `/api/budgets/stats`

Retrieves budget statistics for the authenticated user.

#### Example Request
```
GET /api/budgets/stats
```

#### Response
```json
{
  "success": true,
  "data": {
    "totalBudgets": 5,
    "activeBudgets": 4,
    "totalBudgetAmount": 2500,
    "periodStats": {
      "monthly": 3,
      "weekly": 1,
      "quarterly": 1
    },
    "categoryStats": {
      "Food": 500,
      "Transport": 300,
      "Entertainment": 200
    },
    "budgets": [
      {
        "id": "64a1b2c3d4e5f6789012345b",
        "name": "Monthly Food Budget",
        "amount": 500,
        "period": "monthly",
        "category": "Food",
        "color": "#FF5733"
      }
    ]
  }
}
```

### 7. Get Current Active Budgets
**GET** `/api/budgets/current`

Retrieves budgets that are currently active (within their date range).

#### Example Request
```
GET /api/budgets/current
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345b",
      "userId": "64a1b2c3d4e5f6789012345c",
      "categoryId": {
        "_id": "64a1b2c3d4e5f6789012345a",
        "name": "Food",
        "color": "#FF5733",
        "icon": "restaurant"
      },
      "name": "Monthly Food Budget",
      "description": "Budget for groceries and dining out",
      "amount": 500,
      "period": "monthly",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z",
      "isActive": true,
      "deleted": false,
      "deletedAt": null,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Validation error message"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized access"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "Budget not found"
  }
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": {
    "message": "Budget already exists for this category in the specified date range"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

## Business Rules

1. **Category Validation**: Budgets can only be created for active categories that belong to the user.
2. **Date Validation**: Start date must be before end date.
3. **Overlap Prevention**: Only one budget per category can be active during the same date range.
4. **Soft Delete**: Budgets are soft deleted (marked as deleted) rather than permanently removed.
5. **User Isolation**: Users can only access their own budgets.

## Notes

- All dates are handled in UTC timezone
- Budget amounts are stored as numbers (not strings)
- The API automatically populates related category information
- Pagination is available for the list endpoint
- Search functionality supports partial matching on name and description fields
