import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Table, InputGroup, FormControl, Row, Col, Badge } from 'react-bootstrap';
import { FaPlus, FaEye, FaTrash, FaSearch, FaUsers, FaChartLine, FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const Dashboard = ({ setIsAuthenticated }) => {
  const { state, actions } = useApp();
  const [search, setSearch] = useState('');
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Initial data fetch - only run once on mount
  useEffect(() => {
    const initializeData = async () => {
      if (state.customers.length === 0) {
        await actions.fetchCustomers();
      }
      if (state.leads.length === 0) {
        await actions.fetchLeads();
      }
    };

    initializeData();
  }, [actions, state.customers.length, state.leads.length]); // Include necessary dependencies

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const timeout = setTimeout(() => {
      actions.fetchCustomers(search);
    }, 300); // 300ms debounce

    searchTimeoutRef.current = timeout;

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [search, actions]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await actions.deleteCustomerAsync(id);
        // Refresh data after deletion
        await actions.fetchCustomers(search);
        await actions.fetchLeads();
      } catch (err) {
        alert('Failed to delete customer');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const { customers, stats } = state;

  if (state.loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark mb-1">Customer Dashboard</h2>
          <p className="text-muted mb-0">Manage your customers and track leads</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/reports" className="btn btn-outline-primary">
            <FaChartLine className="me-2" />
            Reports
          </Link>
          <Button onClick={handleLogout} variant="outline-danger" className="d-flex align-items-center">
            <FaSignOutAlt className="me-2" />
            Logout
          </Button>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="card-custom stats-card">
            <Card.Body className="text-center py-4">
              <FaUsers size={32} className="text-primary mb-3" />
              <h3>{stats.totalCustomers}</h3>
              <p>Total Customers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card-custom stats-card stats-card-success">
            <Card.Body className="text-center py-4">
              <FaChartLine size={32} className="text-success mb-3" />
              <h3>{stats.totalLeads}</h3>
              <p>Active Leads</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="card-custom">
        <Card.Header className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-dark"><FaUsers className="me-2 text-primary" />Customer Management</h5>
            <Link to="/add-customer" className="btn btn-custom btn-sm">
              <FaPlus className="me-1" /> Add New
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <InputGroup className="mb-4">
            <InputGroup.Text className="bg-light border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <FormControl
              placeholder="Search customers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control-custom border-start-0"
            />
          </InputGroup>

          <div className="table-responsive">
            <Table className="table-custom">
              <thead>
                <tr>
                  <th className="fw-semibold">Customer Name</th>
                  <th className="fw-semibold">Email Address</th>
                  <th className="fw-semibold">Company</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Loading customers...
                    </td>
                  </tr>
                ) : customers && customers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      <FaBuilding size={24} className="mb-2" />
                      <div>No customers found. Start by adding your first customer.</div>
                    </td>
                  </tr>
                ) : (
                  customers && customers.map(customer => (
                    <tr key={customer._id}>
                      <td className="fw-semibold text-dark">{customer.name}</td>
                      <td className="text-muted">{customer.email}</td>
                      <td>
                        {customer.company ? (
                          <Badge bg="light" text="dark" className="border">
                            {customer.company}
                          </Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        <Link
                          to={`/customer/${customer._id}`}
                          className="btn btn-outline-corporate btn-sm me-2"
                        >
                          <FaEye className="me-1" /> View
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(customer._id)}
                          className="btn-sm"
                        >
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
