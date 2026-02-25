import request from 'supertest';
import app from '../../src/app';

describe('User Settings API Integration', () => {
  let userToken: string;

  beforeAll(async () => {
    const unique = Date.now();
    const registerPayload = {
      firstName: 'Settings',
      lastName: 'Tester',
      username: `settings-${unique}`,
      email: `settings-${unique}@example.com`,
      password: 'Settings123!',
      confirmPassword: 'Settings123!',
    };

    await request(app).post('/api/auth/register').send(registerPayload);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: registerPayload.email,
      password: registerPayload.password,
    });

    userToken = loginRes.body.token;
  });

  it('gets settings for authenticated user', async () => {
    const response = await request(app)
      .get('/api/me/settings')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.language).toBeDefined();
    expect(response.body.data.theme).toBeDefined();
  });

  it('updates general settings', async () => {
    const response = await request(app)
      .put('/api/me/settings/general')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ language: 'de', timezone: 'Europe/Berlin' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.language).toBe('de');
    expect(response.body.data.timezone).toBe('Europe/Berlin');
  });

  it('updates privacy settings', async () => {
    const response = await request(app)
      .put('/api/me/settings/privacy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ profileVisibility: 'public', showActivity: false });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.profileVisibility).toBe('public');
    expect(response.body.data.showActivity).toBe(false);
  });

  it('rejects unauthenticated settings request', async () => {
    const response = await request(app).get('/api/me/settings');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
