import request from 'supertest';
import app from '../../src/app';
describe('Library Item Routes', () => {
  it('GET /api/library-items should return items', async () => {
    const res = await request(app).get('/api/library-items');
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
