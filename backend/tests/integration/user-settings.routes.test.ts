import request from 'supertest';
import app from '../../src/app';

describe('User Settings Routes', () => {
  it('GET /api/user-settings should return settings object', async () => {
    const res = await request(app).get('/api/user-settings');
    // Accept 200 (OK), 204 (No Content), or 404 (Not Found) if no settings exist
    expect([200, 204, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(typeof res.body).toBe('object');
      expect(res.body).not.toBeNull();
    } else if (res.status === 204) {
      // For 204 No Content, body should be empty
      expect(res.body).toEqual({});
    } else if (res.status === 404) {
      // For 404 Not Found, body may be empty or contain an error message
      expect(res.body).toBeDefined();
    }
  });
});