/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = require('../src/app').default;
const { connectDatabase, disconnectDatabase } = require('../src/database/mongodb');
const { UserModel } = require('../src/models/user.model');

function getDbUri(baseUri, dbName) {
  try {
    const parsed = new URL(baseUri);
    parsed.pathname = `/${dbName}`;
    return parsed.toString();
  } catch (_error) {
    return baseUri;
  }
}

async function parseResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_error) {
    return text;
  }
}

async function main() {
  const baseMongoUri = process.env.MONGODB_URI;
  if (!baseMongoUri) {
    throw new Error('MONGODB_URI is missing in environment');
  }

  const dbName = process.env.MANUAL_API_TEST_DB_NAME || 'tridivya_wellness_manual_api_test';
  const mongoUri = getDbUri(baseMongoUri, dbName);
  const port = Number(process.env.MANUAL_API_TEST_PORT || 5062);
  const baseUrl = `http://localhost:${port}`;

  const output = {
    started_at: new Date().toISOString(),
    mongo_db_name: dbName,
    mongo_uri_used: mongoUri,
    base_url: baseUrl,
    steps: [],
    summary: null,
    finished_at: null,
  };

  let server;

  const callApi = async ({ name, method, endpoint, token, body, expectedStatus }) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await parseResponse(response);

    const step = {
      name,
      method,
      endpoint,
      expected_status: expectedStatus,
      actual_status: response.status,
      ok: response.status === expectedStatus,
      response: payload,
    };

    output.steps.push(step);

    console.log(`\n[${step.ok ? 'PASS' : 'FAIL'}] ${name}`);
    console.log(`${method} ${endpoint} -> ${response.status}`);
    console.log(JSON.stringify(payload, null, 2));

    if (!step.ok) {
      throw new Error(`Step failed: ${name}. Expected ${expectedStatus}, got ${response.status}`);
    }

    return payload;
  };

  try {
    await connectDatabase(mongoUri);
    await mongoose.connection.db.dropDatabase();

    await new Promise((resolve) => {
      server = app.listen(port, () => resolve());
    });

    const suffix = Date.now();
    const admin = {
      firstName: 'Live',
      lastName: 'Admin',
      username: `live_admin_${suffix}`,
      email: `live_admin_${suffix}@example.com`,
      password: 'password123',
      confirmPassword: 'password123',
    };

    const user = {
      firstName: 'Live',
      lastName: 'User',
      username: `live_user_${suffix}`,
      email: `live_user_${suffix}@example.com`,
      password: 'password123',
      confirmPassword: 'password123',
    };

    await callApi({
      name: 'Register admin candidate',
      method: 'POST',
      endpoint: '/api/auth/register',
      body: admin,
      expectedStatus: 201,
    });

    await UserModel.updateOne({ email: admin.email }, { role: 'admin' });

    const adminLogin = await callApi({
      name: 'Admin login',
      method: 'POST',
      endpoint: '/api/auth/login',
      body: { email: admin.email, password: admin.password },
      expectedStatus: 200,
    });

    const adminToken = adminLogin.token;

    await callApi({
      name: 'Admin profile',
      method: 'GET',
      endpoint: '/api/auth/profile',
      token: adminToken,
      expectedStatus: 200,
    });

    const meditationSession = await callApi({
      name: 'Create meditation session',
      method: 'POST',
      endpoint: '/api/v1/sessions',
      token: adminToken,
      body: {
        session_type: 'meditation',
        title: 'Mindful Breath',
        difficulty: 'beginner',
        duration_seconds: 600,
        is_featured: true,
        goal_slug: 'stress_relief',
      },
      expectedStatus: 201,
    });

    const yogaSession = await callApi({
      name: 'Create yoga session',
      method: 'POST',
      endpoint: '/api/v1/sessions',
      token: adminToken,
      body: {
        session_type: 'yoga',
        title: 'Morning Flow',
        difficulty: 'intermediate',
        duration_seconds: 1200,
        is_trending: true,
        goal_slug: 'strength',
      },
      expectedStatus: 201,
    });

    const mantraSession = await callApi({
      name: 'Create mantra session',
      method: 'POST',
      endpoint: '/api/v1/sessions',
      token: adminToken,
      body: {
        session_type: 'mantra',
        title: 'Om Chanting',
        difficulty: 'all_levels',
        duration_seconds: 480,
        goal_slug: 'focus',
      },
      expectedStatus: 201,
    });

    const meditationId = meditationSession.data.id;
    const yogaId = yogaSession.data.id;
    const mantraId = mantraSession.data.id;

    await callApi({
      name: 'List sessions',
      method: 'GET',
      endpoint: '/api/v1/sessions?page=1&limit=20',
      expectedStatus: 200,
    });

    await callApi({
      name: 'List yoga sessions filter',
      method: 'GET',
      endpoint: '/api/v1/sessions?session_type=yoga',
      expectedStatus: 200,
    });

    await callApi({
      name: 'Get session by id',
      method: 'GET',
      endpoint: `/api/v1/sessions/${meditationId}`,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Patch session',
      method: 'PATCH',
      endpoint: `/api/v1/sessions/${mantraId}`,
      token: adminToken,
      body: { accent_label: 'TOP_PICK', is_featured: true },
      expectedStatus: 200,
    });

    const libraryItem = await callApi({
      name: 'Create library item',
      method: 'POST',
      endpoint: '/api/v1/library-items',
      token: adminToken,
      body: {
        library_type: 'book',
        title: 'The Calm Mind',
        author_name: 'A. Author',
        read_minutes: 45,
        category_slug: 'wellness',
        is_featured: true,
      },
      expectedStatus: 201,
    });

    const libraryItemId = libraryItem.data.id;

    await callApi({
      name: 'List library items',
      method: 'GET',
      endpoint: '/api/v1/library-items?page=1&limit=20',
      expectedStatus: 200,
    });

    await callApi({
      name: 'Get library item by id',
      method: 'GET',
      endpoint: `/api/v1/library-items/${libraryItemId}`,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Patch library item',
      method: 'PATCH',
      endpoint: `/api/v1/library-items/${libraryItemId}`,
      token: adminToken,
      body: { title: 'The Calmer Mind' },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Home endpoint',
      method: 'GET',
      endpoint: '/api/v1/home',
      expectedStatus: 200,
    });

    await callApi({
      name: 'Mood check-in',
      method: 'POST',
      endpoint: '/api/v1/home/mood-checkins',
      body: { mood_code: 'stressed', note: 'Need calm practice' },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Register normal user',
      method: 'POST',
      endpoint: '/api/auth/register',
      body: user,
      expectedStatus: 201,
    });

    const userLogin = await callApi({
      name: 'Normal user login',
      method: 'POST',
      endpoint: '/api/auth/login',
      body: { email: user.email, password: user.password },
      expectedStatus: 200,
    });

    const userToken = userLogin.token;

    await callApi({
      name: 'Save session',
      method: 'POST',
      endpoint: '/api/v1/me/saved-sessions',
      token: userToken,
      body: { session_id: yogaId },
      expectedStatus: 201,
    });

    await callApi({
      name: 'List saved sessions',
      method: 'GET',
      endpoint: '/api/v1/me/saved-sessions',
      token: userToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Remove saved session',
      method: 'DELETE',
      endpoint: `/api/v1/me/saved-sessions/${yogaId}`,
      token: userToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Save library item',
      method: 'POST',
      endpoint: '/api/v1/me/saved-library-items',
      token: userToken,
      body: { library_item_id: libraryItemId },
      expectedStatus: 201,
    });

    await callApi({
      name: 'List saved library items',
      method: 'GET',
      endpoint: '/api/v1/me/saved-library-items',
      token: userToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Remove saved library item',
      method: 'DELETE',
      endpoint: `/api/v1/me/saved-library-items/${libraryItemId}`,
      token: userToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert session progress',
      method: 'POST',
      endpoint: '/api/v1/me/session-progress',
      token: userToken,
      body: {
        session_id: meditationId,
        progress_percent: 42,
        status: 'in_progress',
        last_position_seconds: 252,
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'List session progress',
      method: 'GET',
      endpoint: '/api/v1/me/session-progress',
      token: userToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Recent sessions',
      method: 'GET',
      endpoint: '/api/v1/me/recent-sessions',
      token: userToken,
      expectedStatus: 200,
    });

    const createdReview = await callApi({
      name: 'Create session review',
      method: 'POST',
      endpoint: `/api/v1/sessions/${meditationId}/reviews`,
      token: userToken,
      body: { rating: 5, title: 'Great', comment: 'Very calming' },
      expectedStatus: 201,
    });

    const reviewId = createdReview.data.id;

    await callApi({
      name: 'List session reviews',
      method: 'GET',
      endpoint: `/api/v1/sessions/${meditationId}/reviews`,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Patch session review',
      method: 'PATCH',
      endpoint: `/api/v1/sessions/${meditationId}/reviews/${reviewId}`,
      token: userToken,
      body: { rating: 4, comment: 'Still very good' },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Delete session review',
      method: 'DELETE',
      endpoint: `/api/v1/sessions/${meditationId}/reviews/${reviewId}`,
      token: userToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Soft delete library item',
      method: 'DELETE',
      endpoint: `/api/v1/library-items/${libraryItemId}`,
      token: adminToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Soft delete session',
      method: 'DELETE',
      endpoint: `/api/v1/sessions/${mantraId}`,
      token: adminToken,
      expectedStatus: 200,
    });

    const passed = output.steps.filter((x) => x.ok).length;
    const failed = output.steps.length - passed;
    output.summary = { passed, failed, total: output.steps.length };
    output.finished_at = new Date().toISOString();

    const reportPath = path.resolve(process.cwd(), 'live-api-test-output.json');
    fs.writeFileSync(reportPath, JSON.stringify(output, null, 2), 'utf-8');

    console.log('\n=== LIVE API TEST SUMMARY ===');
    console.log(JSON.stringify(output.summary, null, 2));
    console.log(`Report written to: ${reportPath}`);

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    output.finished_at = new Date().toISOString();
    output.summary = {
      passed: output.steps.filter((x) => x.ok).length,
      failed: output.steps.filter((x) => !x.ok).length + 1,
      total: output.steps.length + 1,
      error: error instanceof Error ? error.message : String(error),
    };

    const reportPath = path.resolve(process.cwd(), 'live-api-test-output.json');
    fs.writeFileSync(reportPath, JSON.stringify(output, null, 2), 'utf-8');

    console.error('\nLIVE API TEST FAILED');
    console.error(error);
    console.error(`Partial report written to: ${reportPath}`);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(() => resolve()));
    }
    await disconnectDatabase();
  }
}

main();
