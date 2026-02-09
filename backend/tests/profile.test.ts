import request from 'supertest';
import app from '../src/app';

const testUser = {
  firstName: 'Profile',
  lastName: 'User',
  username: 'profileuser',
  email: 'profile@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

async function registerAndLogin() {
  await request(app).post('/api/auth/register').send(testUser);
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: testUser.email, password: testUser.password });
  return loginResponse.body.token as string;
}

describe('Profile integration', () => {
  it('rejects profile request without token', async () => {
    const response = await request(app).get('/api/auth/profile');
    expect(response.status).toBe(401);
  });

  it('fetches profile with token', async () => {
    const token = await registerAndLogin();
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(testUser.email);
  });

  it('updates profile with token', async () => {
    const token = await registerAndLogin();
    const response = await request(app)
      .put('/api/auth/update-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Updated', lastName: 'Name' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.firstName).toBe('Updated');
  });

  it('rejects profile update without token', async () => {
    const response = await request(app)
      .put('/api/auth/update-profile')
      .send({ firstName: 'NoAuth' });

    expect(response.status).toBe(401);
  });

  it('deletes profile picture', async () => {
    const token = await registerAndLogin();
    const response = await request(app)
      .delete('/api/auth/profile/picture')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
