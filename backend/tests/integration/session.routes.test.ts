import request from 'supertest';
import app from '../../src/app';

describe('Session Routes', () => {
  it('GET /api/v1/sessions should return sessions array', async () => {
    const res = await request(app).get('/api/v1/sessions');
    // Accept 200 (OK) or 204 (No Content) if no sessions exist
    expect([200, 204]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body.data)).toBe(true);
    } else {
      // For 204 No Content, body should be empty
      expect(res.body).toEqual({});
    }
  });
});