import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../src/app';
import { UserModel } from '../src/models/user.model';
import { JWT_SECRET } from '../src/config';

const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  username: 'adminuser',
  email: 'admin@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

const normalUser = {
  firstName: 'Normal',
  lastName: 'User',
  username: 'normaluser',
  email: 'normal@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

async function createAdminToken() {
  await request(app).post('/api/auth/register').send(adminUser);
  const admin = await UserModel.findOneAndUpdate(
    { email: adminUser.email },
    { role: 'admin' },
    { new: true }
  );
  if (!admin) {
    throw new Error('Admin user not found');
  }

  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      username: admin.username,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

async function createUserToken() {
  await request(app).post('/api/auth/register').send(normalUser);
  const user = await UserModel.findOne({ email: normalUser.email });
  if (!user) {
    throw new Error('User not found');
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function buildUserPayload(index: number) {
  return {
    firstName: `User${index}`,
    lastName: 'Test',
    username: `user${index}`,
    email: `user${index}@example.com`,
    password: 'password123',
    confirmPassword: 'password123',
  };
}

describe('Admin users integration', () => {
  it('rejects access without token', async () => {
    const response = await request(app).get('/api/admin/users');
    expect(response.status).toBe(401);
  });

  it('rejects non-admin user', async () => {
    const token = await createUserToken();
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it('fetches users with pagination', async () => {
    const token = await createAdminToken();
    const users = Array.from({ length: 12 }, (_, index) => buildUserPayload(index + 1));
    for (const user of users) {
      await request(app).post('/api/auth/register').send(user);
    }

    const response = await request(app)
      .get('/api/admin/users?page=2&limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(5);
    expect(response.body.pagination).toBeDefined();
    expect(response.body.pagination.page).toBe(2);
  });

  it('creates a new user', async () => {
    const token = await createAdminToken();
    const response = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(buildUserPayload(99));

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('gets a user by id', async () => {
    const token = await createAdminToken();
    const createResponse = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(buildUserPayload(100));

    const userId = createResponse.body.data._id;
    const response = await request(app)
      .get(`/api/admin/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(userId);
  });

  it('returns 404 for missing user id', async () => {
    const token = await createAdminToken();
    const missingId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .get(`/api/admin/users/${missingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('updates a user', async () => {
    const token = await createAdminToken();
    const createResponse = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(buildUserPayload(101));

    const userId = createResponse.body.data._id;
    const response = await request(app)
      .put(`/api/admin/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'UpdatedName' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.firstName).toBe('UpdatedName');
  });

  it('rejects duplicate email on update', async () => {
    const token = await createAdminToken();
    const firstResponse = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(buildUserPayload(102));
    await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(buildUserPayload(103));

    const response = await request(app)
      .put(`/api/admin/users/${firstResponse.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'user103@example.com' });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('deletes a user', async () => {
    const token = await createAdminToken();
    const createResponse = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(buildUserPayload(104));

    const response = await request(app)
      .delete(`/api/admin/users/${createResponse.body.data._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('returns 404 when deleting missing user', async () => {
    const token = await createAdminToken();
    const missingId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .delete(`/api/admin/users/${missingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
