import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import API from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Registration failed. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="w-100">
          <Col md={6} lg={5} className="mx-auto">
            <div className="text-center mb-4">
              <FaUserPlus size={48} className="text-primary mb-3" />
              <h1 className="h3 fw-normal text-dark">Join Mini CRM</h1>
              <p className="text-muted">Create your account to get started</p>
            </div>
            
            <Card className="card-custom">
              <Card.Body className="p-4">
                <h4 className="text-center mb-4 text-dark fw-semibold">Create Account</h4>
                
                {error && (
                  <Alert variant="danger" className="alert-custom">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="alert-custom">
                    {success}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">
                      <FaUser className="me-2 text-primary" />Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-custom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">
                      <FaEnvelope className="me-2 text-primary" />Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      className="form-control-custom"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">
                      <FaLock className="me-2 text-primary" />Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className="form-control-custom"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a password"
                      disabled={loading}
                    />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      className="btn-custom py-2" 
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </Form>
                
                <hr className="my-4" />
                
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
