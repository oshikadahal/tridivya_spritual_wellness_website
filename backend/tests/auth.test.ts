import request from 'supertest';
import app from '../src/app';

const testUser = {
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('Auth integration', () => {
  it('registers a new user', async () => {
    const response = await request(app).post('/api/auth/register').send(testUser);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(testUser.email);
  });

  it('prevents duplicate email registration', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, username: 'testuser2' });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('logs in with valid credentials', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it('rejects invalid login', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpass' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
