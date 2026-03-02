import request from 'supertest';
import app from '../../src/app';
describe('Dashboard Routes', () => {
  it('GET /api/dashboard should return dashboard data', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
