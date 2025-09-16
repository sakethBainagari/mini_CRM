import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddCustomer from './pages/AddCustomer';
import CustomerDetail from './pages/CustomerDetail';
import Reports from './pages/Reports';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);

    // Listen for storage changes (when user logs out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setIsAuthenticated(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Container className="main-content">
            <Routes>
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login setIsAuthenticated={setIsAuthenticated} />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard setIsAuthenticated={setIsAuthenticated} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-customer" 
                element={
                  <ProtectedRoute>
                    <AddCustomer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/:id" 
                element={
                  <ProtectedRoute>
                    <CustomerDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
