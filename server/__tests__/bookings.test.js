// In tests/bookings.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

describe('GET /api/bookings', () => {
  test('responds with json', async () => {
    const response = await request(app)
      .get('/api/bookings')
      .expect('Content-Type', /json/)
      .expect(200);
    // Additional assertions...
  });

  // After all tests are done, disconnect from the database
  afterAll(async () => {
    await mongoose.disconnect();
  });
});
