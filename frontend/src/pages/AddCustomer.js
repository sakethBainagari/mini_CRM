import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaBuilding, FaArrowLeft } from 'react-icons/fa';
import API from '../services/api';

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
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
      await API.post('/customers', { name, email, phone, company });
      setSuccess('Customer added successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark mb-1">Add New Customer</h2>
          <p className="text-muted mb-0">Enter customer information below</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline-corporate">
          <FaArrowLeft className="me-2" />Back to Dashboard
        </Link>
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="card-custom">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <FaUserPlus size={40} className="text-primary mb-3" />
                  <h4 className="text-dark fw-semibold">Customer Information</h4>
                </div>
                
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
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label">
                          <FaUser className="me-2 text-primary" />Full Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control-custom"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Customer's full name"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label">
                          <FaEnvelope className="me-2 text-primary" />Email Address *
                        </Form.Label>
                        <Form.Control
                          type="email"
                          className="form-control-custom"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="customer@example.com"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label">
                          <FaPhone className="me-2 text-primary" />Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          className="form-control-custom"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="form-label">
                          <FaBuilding className="me-2 text-primary" />Company
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control-custom"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Company name"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      className="btn-custom py-2" 
                      disabled={loading}
                    >
                      {loading ? (
                        'Adding Customer...'
                      ) : (
                        <>
                          <FaUserPlus className="me-2" />
                          Add Customer
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
                
                <div className="text-center mt-3">
                  <small className="text-muted">* Required fields</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddCustomer;
