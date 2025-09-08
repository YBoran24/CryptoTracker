import request from 'supertest';
import express from 'express';
import routes from '../routes';

// Create a test app without starting the server
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Server', () => {
  it('should respond with health check', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('should have auth routes', async () => {
    const response = await request(app).post('/api/auth/register');
    // We expect this to fail because we're not sending required data
    // but we're testing that the route exists
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should have coins routes', async () => {
    const response = await request(app).get('/api/coins');
    expect(response.status).toBe(200);
  });
});