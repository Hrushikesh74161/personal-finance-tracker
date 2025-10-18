# Categories API Documentation

This document describes the Categories API endpoints for the Personal Finance Tracker application.

## Base URL
All endpoints are prefixed with `/api/categories`

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Category
**POST** `/api/categories`

Creates a new category for the authenticated user.

#### Request Body
```json
{
  "name": "Food & Dining",
  "description": "Expenses related to food and dining out",
  "color": "#FF5733",
  "icon": "restaurant"
}
```

#### Required Fields
- `name`: Category name (1-100 characters)

#### Optional Fields
- `description`: Category description (max 500 characters)
- `color`: Hex color code (default: #3B82F6)
- `icon`: Icon identifier (default: "category")

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "userId": "user_id",
    "name": "Food & Dining",
    "description": "Expenses related to food and dining out",
    "color": "#FF5733",
    "icon": "restaurant",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Categories
**GET** `/api/categories`

Retrieves all categories for the authenticated user with optional filtering and pagination.

#### Query Parameters
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 10, min: 1, max: 100)
- `isActive`: Filter by active status (true/false)
- `search`: Search term for name/description
- `sortBy`: Sort field (name, createdAt, updatedAt)
- `sortOrder`: Sort order (asc/desc)

#### Example Request
```
GET /api/categories?isActive=true&search=food&page=1&limit=10&sortBy=name&sortOrder=asc
```

#### Response
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "category_id",
        "userId": "user_id",
        "name": "Food & Dining",
        "description": "Expenses related to food and dining out",
        "color": "#FF5733",
        "icon": "restaurant",
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

### 3. Get Category by ID
**GET** `/api/categories/:id`

Retrieves a specific category by its ID.

#### Path Parameters
- `id`: Category ID (MongoDB ObjectId)

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "userId": "user_id",
    "name": "Food & Dining",
    "description": "Expenses related to food and dining out",
    "color": "#FF5733",
    "icon": "restaurant",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Category
**PATCH** `/api/categories/:id`

Updates an existing category.

#### Path Parameters
- `id`: Category ID (MongoDB ObjectId)

#### Request Body
Same as create category, but all fields are optional.

#### Example Request
```json
{
  "name": "Food & Groceries",
  "color": "#FF6B35"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "userId": "user_id",
    "name": "Food & Groceries",
    "description": "Expenses related to food and dining out",
    "color": "#FF6B35",
    "icon": "restaurant",
    "isActive": true,
    "deleted": false,
    "deletedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

### 5. Delete Category
**DELETE** `/api/categories/:id`

Soft deletes a category (marks as deleted but doesn't remove from database).

#### Path Parameters
- `id`: Category ID (MongoDB ObjectId)

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Category deleted successfully"
  }
}
```

### 6. Get Category Statistics
**GET** `/api/categories/stats`

Retrieves statistics about categories for the authenticated user.

#### Response
```json
{
  "success": true,
  "data": {
    "totalCategories": 5,
    "activeCategories": 4,
    "categories": [
      {
        "_id": "category_id",
        "name": "Food & Dining",
        "color": "#FF5733",
        "icon": "restaurant"
      }
    ]
  }
}
```

## Category Fields

### Required Fields
- `name`: The name of the category (1-100 characters)

### Optional Fields
- `description`: A description of the category (max 500 characters)
- `color`: Hex color code for the category (default: #3B82F6)
- `icon`: Icon identifier for the category (default: "category")
- `isActive`: Whether the category is active (default: true)

### System Fields
- `_id`: Unique identifier for the category
- `userId`: ID of the user who owns the category
- `deleted`: Soft delete flag (default: false)
- `deletedAt`: Timestamp when category was deleted (null if not deleted)
- `createdAt`: Timestamp when category was created
- `updatedAt`: Timestamp when category was last updated

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Category not found
- `409 Conflict`: Category with same name already exists
- `500 Internal Server Error`: Server errors

#### Example Error Response
```json
{
  "success": false,
  "error": {
    "message": "Category not found"
  }
}
```

## Validation Rules

### Name
- Required for creation
- 1-100 characters
- Case-insensitive uniqueness per user

### Description
- Optional
- Maximum 500 characters

### Color
- Optional
- Must be valid hex color code (e.g., #FF5733)
- Exactly 7 characters

### Icon
- Optional
- Maximum 50 characters

### isActive
- Optional
- Boolean value
- Default: true

## Search and Filtering

### Search
The search parameter searches both name and description fields using case-insensitive matching.

### Filtering
- `isActive`: Filter by active status
- `search`: Search in name and description fields

### Sorting
- `sortBy`: name, createdAt, updatedAt
- `sortOrder`: asc, desc

### Pagination
- `page`: Page number (starts from 1)
- `limit`: Items per page (1-100)
