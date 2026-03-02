import request from 'supertest';
import app from '../../src/app';
describe('Admin User Routes', () => {
  it('GET /api/admin-users should return admin users', async () => {
    const res = await request(app).get('/api/admin-users');
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
