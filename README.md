# Personal Finance Tracker

A full-stack personal finance management application built with React frontend and Node.js/Express backend. Track your expenses, manage budgets, categorize transactions, and monitor your financial health.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup & Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will start on `http://localhost:3000` (or the port specified in your environment variables).

### Frontend Setup & Start

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default port).

## 🔧 Environment Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
MONGODB_URL=mongodb://localhost:27017/personal-finance-tracker
SERVER_PORT=3000
JWT_SECRET=your-jwt-secret-key
```

### Frontend Configuration
The frontend is configured to connect to the backend API. Update the API base URL in `frontend/src/api/apiClient.js` if needed.

## 📁 Project Structure

```
personal-finance-tracker/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   └── util/            # Utility functions
│   ├── tests/               # Test files
│   └── docs/                # API documentation
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── api/             # API integration hooks
│   │   ├── redux/           # State management
│   │   └── constants/       # App constants
└── README.md
```

## 🛠️ Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                    # Run all tests
npm run test:services      # Run service tests only
npm run test:middleware    # Run middleware tests only
npm run test:coverage      # Run with coverage report
```

### Frontend Testing
The frontend uses Vite for development and building. Tests can be added using Jest or Vitest.

## 📚 API Documentation

Detailed API documentation is available in the `backend/docs/` directory:
- [Authentication API](backend/docs/AUTH_API_DOCUMENTATION.md)
- [Accounts API](backend/docs/ACCOUNTS_API_DOCUMENTATION.md)
- [Transactions API](backend/docs/TRANSACTION_API_DOCUMENTATION.md)
- [Categories API](backend/docs/CATEGORIES_API_DOCUMENTATION.md)
- [Budget API](backend/docs/BUDGET_API_DOCUMENTATION.md)

## 🎯 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Account Management**: Create and manage multiple financial accounts
- **Transaction Tracking**: Record income and expenses with categories
- **Budget Management**: Set and monitor monthly budgets
- **Category Management**: Organize transactions with custom categories
- **Regular Payments**: Track recurring payments and subscriptions
- **Financial Dashboard**: Overview of your financial health
- **Responsive Design**: Mobile-friendly interface with Material-UI

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Environment variable configuration

## 🔄 Development Workflow

1. Start MongoDB service
2. Start backend server (`npm run dev` in backend directory)
3. Start frontend server (`npm run dev` in frontend directory)
4. Access the application at `http://localhost:5173`

## 📝 Notes

- The backend uses ES6 modules
- Frontend uses React 19 with Material-UI components
- State management handled by Redux Toolkit
- API calls managed with React Query (TanStack Query)
- Form handling with Formik and Yup validation