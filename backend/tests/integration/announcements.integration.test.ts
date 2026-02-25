import request from 'supertest';
import app from '../../src/app';
import { UserModel } from '../../src/models/user.model';
import { AnnouncementModel } from '../../src/models/announcement.model';

describe('Announcements API Integration', () => {
  let adminToken: string;
  let announcementId: string;

  beforeAll(async () => {
    const unique = Date.now();
    const registerPayload = {
      firstName: 'Admin',
      lastName: 'Tester',
      username: `admin-${unique}`,
      email: `admin-${unique}@example.com`,
      password: 'Admin123!',
      confirmPassword: 'Admin123!',
    };

    await request(app).post('/api/auth/register').send(registerPayload);
    await UserModel.updateOne({ email: registerPayload.email }, { role: 'admin' });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: registerPayload.email,
      password: registerPayload.password,
    });

    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    await AnnouncementModel.deleteMany({ title: /Integration Announcement/i });
  });

  it('creates an announcement as admin', async () => {
    const payload = {
      title: 'Integration Announcement',
      message: 'System update scheduled.',
      tone: 'calm',
      status: 'draft',
    };

    const response = await request(app)
      .post('/api/admin/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(payload.title);
    expect(response.body.data.id).toBeDefined();

    announcementId = response.body.data.id;
  });

  it('lists announcements for admin', async () => {
    const response = await request(app)
      .get('/api/admin/announcements')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('publishes an announcement', async () => {
    const response = await request(app)
      .post(`/api/admin/announcements/${announcementId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('published');
  });

  it('returns published announcements when authenticated', async () => {
    const response = await request(app)
      .get('/api/admin/announcements/public/list')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
