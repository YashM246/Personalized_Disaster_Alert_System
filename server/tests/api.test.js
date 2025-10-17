/**
 * API Endpoint Tests
 * Tests the Express API routes using Supertest
 */

const request = require('supertest');
const express = require('express');
const alertRoutes = require('../routes/alert');

// Create test app
const app = express();
app.use(express.json());
app.use('/api', alertRoutes);

describe('API Endpoint Tests', () => {

  describe('GET /api/health', () => {
    test('Should return 200 status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });

    test('Should return JSON', async () => {
      const response = await request(app).get('/api/health');
      expect(response.type).toBe('application/json');
    });

    test('Should have status field', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });

    test('Should have timestamp field', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/generate-alert', () => {
    test('Should return 400 for missing ZIP code', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Should return 400 for invalid ZIP format', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({ zipCode: '123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid ZIP code format');
    });

    test('Should return 400 for non-numeric ZIP', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({ zipCode: 'ABCDE' });

      expect(response.status).toBe(400);
    });

    test('Should return 404 for unknown ZIP code', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({ zipCode: '99999' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('availableZipCodes');
    });

    test('Should list available ZIP codes on 404', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({ zipCode: '99999' });

      expect(Array.isArray(response.body.availableZipCodes)).toBe(true);
      expect(response.body.availableZipCodes.length).toBe(10);
    });

    test('Should return 200 for valid ZIP code', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({ zipCode: '90210' });

      expect(response.status).toBe(200);
    }, 10000); // Increased timeout for API call

    test('Should return complete disaster object', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({ zipCode: '90210' });

      expect(response.body).toHaveProperty('disaster');
      expect(response.body.disaster).toHaveProperty('type');
      expect(response.body.disaster).toHaveProperty('severity');
      expect(response.body.disaster).toHaveProperty('status');
      expect(response.body.disaster).toHaveProperty('distance');
      expect(response.body.disaster).toHaveProperty('impactTime');
    }, 10000);

    test('Should return complete alert object', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({ zipCode: '90210' });

      expect(response.body).toHaveProperty('alert');
      expect(response.body.alert).toHaveProperty('headline');
      expect(response.body.alert).toHaveProperty('body');
      expect(response.body.alert).toHaveProperty('actions');
      expect(response.body.alert).toHaveProperty('translations');
    }, 10000);

    test('Should return location information', async () => {
      const response = await request(app)
        .post('/api/generate-alert')
        .send({ zipCode: '90210' });

      expect(response.body).toHaveProperty('location');
      expect(response.body.location.zipCode).toBe('90210');
      expect(response.body.location).toHaveProperty('neighborhood');
    }, 10000);

    test('Should work for all valid ZIP codes', async () => {
      const zipCodes = ['90210', '90022', '94102', '33139', '90802'];

      for (const zip of zipCodes) {
        const response = await request(app)
          .post('/api/generate-alert')
          .send({ zipCode: zip });

        expect(response.status).toBe(200);
        expect(response.body.location.zipCode).toBe(zip);
      }
    }, 30000); // Longer timeout for multiple calls

    test('Should return different disasters on multiple calls', async () => {
      const disasters = [];

      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/api/generate-alert')
          .send({ zipCode: '90210' });

        disasters.push(response.body.disaster);
      }

      // Check that we got some variety
      const types = new Set(disasters.map(d => d.type));
      const severities = new Set(disasters.map(d => d.severity));

      expect(types.size).toBeGreaterThan(1);
    }, 30000);
  });

  describe('Invalid Routes', () => {
    test('Should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});
