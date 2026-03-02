import request from 'supertest';
import app from '../../src/app';
describe('Meditation Routes', () => {
  it('GET /api/meditations should return meditations', async () => {
    const res = await request(app).get('/api/meditations');
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
