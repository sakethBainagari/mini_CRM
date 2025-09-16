import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Form, Row, Col, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaPlus, FaTrash, FaArrowLeft, FaBullhorn } from 'react-icons/fa';
import API from '../services/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newLead, setNewLead] = useState({ title: '', description: '', status: 'New', value: 0 });

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/customers/${id}`);
      // Handle new API response structure
      setCustomer(data.customer || data);
      setLeads(data.leads || []);
    } catch (err) {
      setError('Failed to fetch customer details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await API.post('/leads', { ...newLead, customerId: id });
      fetchCustomer();
      setNewLead({ title: '', description: '', status: 'New', value: 0 });
    } catch (err) {
      setError('Failed to add lead');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await API.delete(`/leads/${leadId}`);
        fetchCustomer();
      } catch (err) {
        setError('Failed to delete lead');
      }
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'New': return 'primary';
      case 'Contacted': return 'warning';
      case 'Converted': return 'success';
      case 'Lost': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading customer details...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="alert-custom">{error}</Alert>;
  }

  if (!customer) return <Alert variant="warning">Customer not found</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark mb-1">{customer.name}</h2>
          <p className="text-muted mb-0">Customer details and lead management</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline-corporate">
          <FaArrowLeft className="me-2" />Back to Dashboard
        </Link>
      </div>

      <Row>
        <Col lg={4}>
          <Card className="card-custom mb-4">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-dark fw-semibold">
                <FaUser className="me-2 text-primary" />Customer Information
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-3">
                <h5 className="fw-semibold text-dark mb-1">{customer.name}</h5>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaEnvelope className="me-2 text-primary" style={{ width: '16px' }} />
                  <span className="text-muted small">Email</span>
                </div>
                <p className="mb-0 text-dark">{customer.email}</p>
              </div>
              
              {customer.phone && (
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaPhone className="me-2 text-success" style={{ width: '16px' }} />
                    <span className="text-muted small">Phone</span>
                  </div>
                  <p className="mb-0 text-dark">{customer.phone}</p>
                </div>
              )}
              
              {customer.company && (
                <div className="mb-0">
                  <div className="d-flex align-items-center mb-2">
                    <FaBuilding className="me-2 text-info" style={{ width: '16px' }} />
                    <span className="text-muted small">Company</span>
                  </div>
                  <Badge bg="light" text="dark" className="border">
                    {customer.company}
                  </Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="card-custom">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-dark fw-semibold">
                <FaBullhorn className="me-2 text-primary" />Leads & Opportunities
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="bg-light rounded p-4 mb-4">
                <h6 className="fw-semibold mb-3 text-dark">
                  <FaPlus className="me-2 text-primary" />Add New Lead
                </h6>
                <Form onSubmit={handleAddLead}>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label">Lead Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter lead title"
                          value={newLead.title}
                          onChange={(e) => setNewLead({ ...newLead, title: e.target.value })}
                          required
                          className="form-control-custom"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label">Status</Form.Label>
                        <Form.Select
                          value={newLead.status}
                          onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                          className="form-control-custom"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label">Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Enter lead description"
                          value={newLead.description}
                          onChange={(e) => setNewLead({ ...newLead, description: e.target.value })}
                          className="form-control-custom"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label">Value ($)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="0"
                          value={newLead.value}
                          onChange={(e) => setNewLead({ ...newLead, value: parseFloat(e.target.value) || 0 })}
                          className="form-control-custom"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" className="btn-custom">
                    <FaPlus className="me-2" />Add Lead
                  </Button>
                </Form>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0 text-dark">
                  Existing Leads ({leads.length})
                </h6>
              </div>
              
              {leads.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <FaBullhorn size={32} className="mb-3 opacity-50" />
                  <p className="mb-0">No leads yet. Add your first lead above!</p>
                </div>
              ) : (
                <div className="row g-3">
                  {leads.map(lead => (
                    <div key={lead._id} className="col-12">
                      <Card className="border">
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="fw-semibold text-dark mb-2">{lead.title}</h6>
                              {lead.description && (
                                <p className="text-muted small mb-2">{lead.description}</p>
                              )}
                              <div className="d-flex align-items-center gap-3">
                                <Badge bg={getStatusVariant(lead.status)}>
                                  {lead.status}
                                </Badge>
                                <span className="text-success fw-semibold">
                                  ${lead.value.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteLead(lead._id)}
                              className="ms-3"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDetail;
