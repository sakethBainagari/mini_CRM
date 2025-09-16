const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user');
const Customer = require('../models/customer');

describe('Customers API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Connect to test database only if not connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/crm_test');
    }
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Customer.deleteMany({});

    // Create a test user and get token
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: await require('bcryptjs').hash('password123', 10),
      role: 'user'
    });
    await user.save();
    userId = user._id;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    token = loginResponse.body.token;
  });

  describe('GET /api/customers', () => {
    it('should return empty array when no customers exist', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.customers).toEqual([]);
    });

    it('should return customers for authenticated user', async () => {
      // Create test customers
      const customer1 = new Customer({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        company: 'ABC Corp',
        user: userId
      });
      const customer2 = new Customer({
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        company: 'XYZ Ltd',
        user: userId
      });
      await customer1.save();
      await customer2.save();

      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.customers).toHaveLength(2);
      expect(response.body.customers[0]).toHaveProperty('name', 'John Doe');
      expect(response.body.customers[1]).toHaveProperty('name', 'Jane Smith');
    });

    it('should filter customers by search term', async () => {
      // Create test customers
      const customer1 = new Customer({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'ABC Corp',
        user: userId
      });
      const customer2 = new Customer({
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: 'XYZ Ltd',
        user: userId
      });
      await customer1.save();
      await customer2.save();

      const response = await request(app)
        .get('/api/customers?search=John')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.customers).toHaveLength(1);
      expect(response.body.customers[0]).toHaveProperty('name', 'John Doe');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/customers')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/customers', () => {
    it('should create a new customer successfully', async () => {
      const customerData = {
        name: 'New Customer',
        email: 'new@example.com',
        phone: '1234567890',
        company: 'New Corp',
        address: '123 Main St'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .send(customerData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.customer).toHaveProperty('name', 'New Customer');
      expect(response.body.customer).toHaveProperty('email', 'new@example.com');
      expect(response.body.customer).toHaveProperty('company', 'New Corp');
      expect(response.body.customer).toHaveProperty('user', userId.toString());
    });

    it('should return validation error for missing required fields', async () => {
      const customerData = {
        email: 'test@example.com'
        // Missing name
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .send(customerData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('name');
    });

    it('should return validation error for invalid email', async () => {
      const customerData = {
        name: 'Test Customer',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .send(customerData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email');
    });

    it('should return 401 without authentication', async () => {
      const customerData = {
        name: 'Test Customer',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/customers')
        .send(customerData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/customers/:id', () => {
    let customerId;

    beforeEach(async () => {
      // Create a test customer
      const customer = new Customer({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890',
        company: 'Test Corp',
        user: userId
      });
      await customer.save();
      customerId = customer._id;
    });

    it('should return customer by id', async () => {
      const response = await request(app)
        .get(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.customer).toHaveProperty('name', 'Test Customer');
      expect(response.body.customer).toHaveProperty('_id', customerId.toString());
    });

    it('should return 404 for non-existent customer', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/customers/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Customer not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/customers/${customerId}`)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/customers/:id', () => {
    let customerId;

    beforeEach(async () => {
      // Create a test customer
      const customer = new Customer({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890',
        company: 'Test Corp',
        user: userId
      });
      await customer.save();
      customerId = customer._id;
    });

    it('should update customer successfully', async () => {
      const updateData = {
        name: 'Updated Customer',
        company: 'Updated Corp'
      };

      const response = await request(app)
        .put(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.customer).toHaveProperty('name', 'Updated Customer');
      expect(response.body.customer).toHaveProperty('company', 'Updated Corp');
      expect(response.body.customer).toHaveProperty('email', 'test@example.com'); // Unchanged
    });

    it('should return 404 for non-existent customer', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/customers/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Customer not found');
    });

    it('should return 401 without authentication', async () => {
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/customers/${customerId}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('DELETE /api/customers/:id', () => {
    let customerId;

    beforeEach(async () => {
      // Create a test customer
      const customer = new Customer({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890',
        company: 'Test Corp',
        user: userId
      });
      await customer.save();
      customerId = customer._id;
    });

    it('should delete customer successfully', async () => {
      const response = await request(app)
        .delete(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Customer deleted successfully');

      // Verify customer is deleted
      const deletedCustomer = await Customer.findById(customerId);
      expect(deletedCustomer).toBeNull();
    });

    it('should return 404 for non-existent customer', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/customers/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Customer not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete(`/api/customers/${customerId}`)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});
