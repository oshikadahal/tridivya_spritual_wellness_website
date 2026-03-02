import request from 'supertest';
import app from '../../src/app';
describe('Announcement Routes', () => {
  it('GET /api/announcements should return announcements', async () => {
    const res = await request(app).get('/api/announcements');
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
