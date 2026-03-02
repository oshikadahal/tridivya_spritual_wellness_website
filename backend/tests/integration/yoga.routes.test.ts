
import request from 'supertest';
import app from '../../src/app';

describe('Yoga Routes', () => {
  it('GET /api/v1/yogas should return yoga array', async () => {
    const res = await request(app).get('/api/v1/yogas');
    // Accept 200 (OK) or 204 (No Content)
    expect([200, 204]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });
});
