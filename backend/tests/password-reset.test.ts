import request from 'supertest';
import crypto from 'crypto';
import app from '../src/app';
import { UserModel } from '../src/models/user.model';

jest.mock('../src/utils/email', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

const testUser = {
  firstName: 'Reset',
  lastName: 'User',
  username: 'resetuser',
  email: 'reset@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('Password reset integration', () => {
  it('sends reset response for existing user', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testUser.email });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('sends reset response for unknown user', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'missing@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('rejects reset with invalid token', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'invalidtokenvalue', password: 'newpass123', confirmPassword: 'newpass123' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('rejects reset with mismatched passwords', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'invalidtokenvalue', password: 'newpass123', confirmPassword: 'different123' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('resets password with valid token', async () => {
    await request(app).post('/api/auth/register').send({
      ...testUser,
      username: 'resetuser2',
      email: 'reset2@example.com',
    });

    const token = 'tokenvalueforreset1234567890';
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await UserModel.findOneAndUpdate(
      { email: 'reset2@example.com' },
      { resetPasswordToken: tokenHash, resetPasswordExpires: expiresAt }
    );

    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'newpass123', confirmPassword: 'newpass123' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'reset2@example.com', password: 'newpass123' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
  });
});
