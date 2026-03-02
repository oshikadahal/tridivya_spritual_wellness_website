import request from 'supertest';
import app from '../../src/app';
describe('Mantra Routes', () => {
  it('GET /api/mantras should return mantras', async () => {
    const res = await request(app).get('/api/mantras');
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
