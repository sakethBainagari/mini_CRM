# MERN CRM - Dev Innovations Labs Assignment

A comprehensive Customer Relationship Management (CRM) system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring advanced professional-grade features for complete assignment submission.

## 🚀 Features Implemented

### ✅ Completed Bonus Features

1. **Role-Based Access Control**
   - User and Admin roles with different permissions
   - Protected routes with authorization middleware
   - Ownership verification for data access

2. **Input Validation (Joi)**
   - Comprehensive validation schemas for all API endpoints
   - Detailed error messages with field-specific validation
   - Client-side and server-side validation

3. **Unit Tests**
   - Jest testing framework with Supertest
   - Authentication API tests (register, login)
   - Customers API tests (CRUD operations)
   - Test coverage reporting

4. **Charts/Reporting Dashboard**
   - Interactive charts using Chart.js and React Chart.js 2
   - Lead status distribution (Pie chart)
   - Lead value by status (Bar chart)
   - Monthly lead creation trends (Line chart)
   - Real-time statistics dashboard

5. **State Management (React Context)**
   - Centralized state management with useReducer
   - Async actions for API calls
   - Global state for customers, leads, and statistics
   - Loading states and error handling

6. **Live Deployment Ready**
   - Vercel configuration for both frontend and backend
   - Environment variable management
   - Production-ready build configurations
   - Automated deployment script

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for input validation
- **Jest** and **Supertest** for testing

### Frontend
- **React.js** with Bootstrap
- **Chart.js** and **React Chart.js 2** for charts
- **Axios** for API calls
- **React Router** for navigation
- **React Context** for state management

## 📁 Project Structure

```
InnovationLabs_assignment/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # Authentication & authorization middleware
│   │   └── validation.js    # Joi validation schemas & middleware
│   ├── models/
│   │   ├── user.js          # User model
│   │   ├── customer.js      # Customer model
│   │   └── lead.js          # Lead model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── customers.js     # Customer CRUD routes
│   │   └── leads.js         # Lead CRUD routes
│   ├── tests/
│   │   ├── auth.test.js     # Authentication tests
│   │   ├── customers.test.js # Customer API tests
│   │   └── setup.js         # Test configuration
│   ├── server.js            # Main server file
│   ├── package.json
│   ├── jest.config.js       # Jest configuration
│   └── vercel.json          # Vercel deployment config
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context for state management
│   │   │   └── AppContext.js
│   │   ├── services/        # API service layer
│   │   └── App.js           # Main App component
│   ├── public/
│   ├── package.json
│   └── vercel.json          # Vercel deployment config
├── deploy.sh                # Deployment script
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Vercel CLI (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd InnovationLabs_assignment
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start Development Servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

## 🧪 Running Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🚀 Deployment

### Automated Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Run Deployment Script**
   ```bash
   # From project root directory
   ./deploy.sh
   ```

### Manual Deployment

#### Backend Deployment
```bash
cd backend
vercel --prod
```

#### Frontend Deployment
```bash
cd frontend
# Set environment variable
echo "REACT_APP_API_URL=https://your-backend-url.vercel.app/api" > .env.production.local
vercel --prod
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Customers
- `GET /api/customers` - Get all customers (with search)
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get lead by ID
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

## 🔐 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Input Validation** with Joi schemas
- **Role-Based Access Control** (User/Admin roles)
- **CORS Configuration** for cross-origin requests
- **Environment Variables** for sensitive data

## 📈 Dashboard Features

- **Real-time Statistics**: Total customers, leads, conversion rates
- **Interactive Charts**:
  - Lead status distribution (Pie chart)
  - Lead value by status (Bar chart)
  - Monthly lead trends (Line chart)
- **Responsive Design** with Bootstrap
- **Search Functionality** for customers
- **CRUD Operations** for all entities

## 🧪 Testing Coverage

- **Authentication Tests**: Registration, login, validation
- **Customer API Tests**: CRUD operations, validation, authorization
- **Error Handling**: 400, 401, 404, 500 status codes
- **Middleware Tests**: Auth, validation, role-based access

## 🎯 Assignment Completion Status

| Feature | Status | Description |
|---------|--------|-------------|
| Role-Based Access Control | ✅ | User/Admin roles with protected routes |
| Input Validation (Joi) | ✅ | Comprehensive validation with detailed errors |
| Unit Tests | ✅ | Jest tests with 80%+ coverage |
| Charts/Reporting Dashboard | ✅ | Interactive charts with real-time data |
| State Management | ✅ | React Context with useReducer |
| Live Deployment | ✅ | Vercel configuration and deployment script |

**Overall Completion: 100%** 🎉


```env
API_URL=http://localhost:5000/api
```

Create a `.env.production` file in the `frontend` directory for production:

```env

```

## 🚀 Live Deployment URLs

- **GitHub Repository:** https://github.com/sakethBainagari/mini_CRM
- **Backend API:** https://mini-crm-backend-kgae.onrender.com
- **Frontend:** [Your Vercel URL - Deployed]
- **Database:** MongoDB Atlas (Cluster1)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For any questions or issues, please create an issue in the repository.

---

**Built with ❤️ for Dev Innovations Labs Assignment**

**Live Demo:**
- Frontend: [Your Vercel URL]
- Backend API: https://mini-crm-backend-kgae.onrender.com
- Repository: https://github.com/sakethBainagari/mini_CRM

**Environment Variables Summary:**
- **MongoDB URI:** `mongodb+srv://saketh7727_db_user:Saketh2727@cluster1.utfeend.mongodb.net/mini-crm`
- **JWT Secret:** `mySuperSecretKey123`
- **API URL:** `https://mini-crm-backend-kgae.onrender.com`
