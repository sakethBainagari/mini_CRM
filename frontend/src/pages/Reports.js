import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaChartBar, FaChartPie, FaChartLine, FaUsers, FaDollarSign, FaArrowLeft } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Reports = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    // Fetch data if not already loaded - only run once on mount
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

  if (state.loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading reports...</p>
      </div>
    );
  }

  if (state.error) {
    return <Alert variant="danger" className="alert-custom">{state.error}</Alert>;
  }

  const { leads, stats } = state;

  // Calculate lead status distribution
  const statusCounts = leads && leads.length > 0 ? leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {}) : {};

  // Calculate monthly lead creation
  const monthlyData = leads && leads.length > 0 ? leads.reduce((acc, lead) => {
    const month = new Date(lead.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {}) : {};

  // Calculate lead value by status
  const valueByStatus = leads && leads.length > 0 ? leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + (lead.value || 0);
    return acc;
  }, {}) : {};

  // Chart data
  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      label: 'Leads by Status',
      data: Object.values(statusCounts),
      backgroundColor: [
        '#3498db', // New - Blue
        '#f39c12', // Contacted - Orange
        '#27ae60', // Converted - Green
        '#e74c3c'  // Lost - Red
      ],
      borderColor: [
        '#2980b9',
        '#e67e22',
        '#229954',
        '#c0392b'
      ],
      borderWidth: 2,
    }],
  };

  const monthlyChartData = {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: 'Leads Created',
      data: Object.values(monthlyData),
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  const valueChartData = {
    labels: Object.keys(valueByStatus),
    datasets: [{
      label: 'Lead Value ($)',
      data: Object.values(valueByStatus),
      backgroundColor: [
        '#3498db',
        '#f39c12',
        '#27ae60',
        '#e74c3c'
      ],
      borderColor: [
        '#2980b9',
        '#e67e22',
        '#229954',
        '#c0392b'
      ],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Lead Analytics Dashboard',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark mb-1">Reports & Analytics</h2>
          <p className="text-muted mb-0">Lead performance and customer insights</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline-corporate">
          <FaArrowLeft className="me-2" />Back to Dashboard
        </Link>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="card-custom stats-card">
            <Card.Body className="text-center py-4">
              <FaUsers size={32} className="text-primary mb-3" />
              <h3>{stats.totalCustomers}</h3>
              <p>Total Customers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom stats-card">
            <Card.Body className="text-center py-4">
              <FaChartBar size={32} className="text-info mb-3" />
              <h3>{stats.totalLeads}</h3>
              <p>Total Leads</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom stats-card">
            <Card.Body className="text-center py-4">
              <FaDollarSign size={32} className="text-success mb-3" />
              <h3>${stats.totalValue.toLocaleString()}</h3>
              <p>Total Lead Value</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-custom stats-card">
            <Card.Body className="text-center py-4">
              <FaChartLine size={32} className="text-warning mb-3" />
              <h3>{stats.totalLeads > 0 ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) : 0}%</h3>
              <p>Conversion Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="card-custom">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-dark fw-semibold">
                <FaChartPie className="me-2 text-primary" />Lead Status Distribution
              </h6>
            </Card.Header>
            <Card.Body>
              <Pie data={statusChartData} options={pieOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card-custom">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-dark fw-semibold">
                <FaChartBar className="me-2 text-primary" />Lead Value by Status
              </h6>
            </Card.Header>
            <Card.Body>
              <Bar data={valueChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="card-custom">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-dark fw-semibold">
                <FaChartLine className="me-2 text-primary" />Monthly Lead Creation Trend
              </h6>
            </Card.Header>
            <Card.Body>
              <Line data={monthlyChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
