# Authentication API Documentation

This document describes the authentication API endpoints for the Personal Expense Tracker application.

## Base URL
```
http://localhost:3000/api/auth
```

## Environment Variables Required
Create a `.env` file in the backend root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/personal-expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

## API Endpoints

### 1. User Signup
**POST** `/api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `firstName`: Required, 2-50 characters, letters and spaces only
- `lastName`: Optional, max 50 characters, letters and spaces only
- `email`: Required, valid email format
- `password`: Required, min 8 characters, must contain uppercase, lowercase, number, and special character

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "User with this email already exists"
  },
  "data": null
}
```

### 2. User Login
**POST** `/api/auth/login`

Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error" : {
    "message": "Invalid email or password",
  }
  "data": null
}
```