/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = require('../dist/app').default;
const { connectDatabase, disconnectDatabase } = require('../dist/database/mongodb');
const { UserModel } = require('../dist/models/user.model');

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

  const manualDbName = process.env.MANUAL_API_TEST_DB_NAME;
  // If caller sets MANUAL_API_TEST_DB_NAME to 'USE_URI', use the MONGODB_URI as-is
  // Otherwise fall back to provided DB name or the default manual test DB.
  const mongoUri = (manualDbName && manualDbName !== 'USE_URI')
    ? getDbUri(baseMongoUri, manualDbName)
    : baseMongoUri;
  const port = Number(process.env.MANUAL_API_TEST_PORT || 5062);
  const baseUrl = `http://localhost:${port}`;

  const output = {
    started_at: new Date().toISOString(),
    mongo_db_name: (manualDbName && manualDbName !== 'USE_URI') ? manualDbName : '(from MONGODB_URI)',
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
    if (response.status !== expectedStatus) {
      console.log(JSON.stringify(payload, null, 2));
    }

    if (!step.ok) {
      throw new Error(`Step failed: ${name}. Expected ${expectedStatus}, got ${response.status}`);
    }

    return payload;
  };

  try {
    await connectDatabase(mongoUri);
    console.log('Connected to MongoDB. Clearing database...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared.');

    console.log(`\n=== Starting server on port ${port} ===`);
    await new Promise((resolve) => {
      server = app.listen(port, () => resolve());
    });

    const suffix = Date.now();

    // 1. Register admin candidate
    const admin = {
      firstName: 'Admin',
      lastName: 'User',
      username: `admin_${suffix}`,
      email: `admin_${suffix}@example.com`,
      password: 'Admin@123',
      confirmPassword: 'Admin@123',
    };

    await callApi({
      name: 'Register admin candidate',
      method: 'POST',
      endpoint: '/api/auth/register',
      body: admin,
      expectedStatus: 201,
    });

    // Promote to admin
    await UserModel.updateOne({ email: admin.email }, { role: 'admin' });

    // 2. Admin login
    const adminLogin = await callApi({
      name: 'Admin login',
      method: 'POST',
      endpoint: '/api/auth/login',
      body: { email: admin.email, password: admin.password },
      expectedStatus: 200,
    });

    const adminToken = adminLogin.token;

    // 3. Register normal user
    const user = {
      firstName: 'Normal',
      lastName: 'User',
      username: `user_${suffix}`,
      email: `user_${suffix}@example.com`,
      password: 'User@123',
      confirmPassword: 'User@123',
    };

    await callApi({
      name: 'Register normal user',
      method: 'POST',
      endpoint: '/api/auth/register',
      body: user,
      expectedStatus: 201,
    });

    // 4. Normal user login
    const userLogin = await callApi({
      name: 'Normal user login',
      method: 'POST',
      endpoint: '/api/auth/login',
      body: { email: user.email, password: user.password },
      expectedStatus: 200,
    });

    const userToken = userLogin.token;

   // 5-8. Create multiple meditations (Admin)
    const meditation1 = await callApi({
      name: 'Create meditation 1 - Mindful Breathing',
      method: 'POST',
      endpoint: '/api/v1/meditations',
      token: adminToken,
      body: {
        title: 'Mindful Breathing',
        subtitle: 'Calm your mind',
        description: 'A guided meditation for relaxation and stress relief',
        image_url: 'https://example.com/meditation1.jpg',
        media_url: 'https://example.com/meditation1.mp3',
        duration_seconds: 600,
        difficulty: 'beginner',
        goal_slug: 'stress_relief',
        is_featured: true,
        is_trending: false,
      },
      expectedStatus: 201,
    });

    const meditation2 = await callApi({
      name: 'Create meditation 2 - Body Scan',
      method: 'POST',
      endpoint: '/api/v1/meditations',
      token: adminToken,
      body: {
        title: 'Body Scan Meditation',
        subtitle: 'Release tension',
        description: 'Progressive relaxation through body awareness',
        image_url: 'https://example.com/meditation2.jpg',
        media_url: 'https://example.com/meditation2.mp3',
        duration_seconds: 900,
        difficulty: 'intermediate',
        goal_slug: 'better_sleep',
        is_featured: false,
        is_trending: true,
      },
      expectedStatus: 201,
    });

    const meditation3 = await callApi({
      name: 'Create meditation 3 - Loving Kindness',
      method: 'POST',
      endpoint: '/api/v1/meditations',
      token: adminToken,
      body: {
        title: 'Loving Kindness Meditation',
        subtitle: 'Cultivate compassion',
        description: 'Metta meditation for self-love and compassion',
        image_url: 'https://example.com/meditation3.jpg',
        media_url: 'https://example.com/meditation3.mp3',
        duration_seconds: 1200,
        difficulty: 'advanced',
        goal_slug: 'emotional_balance',
        is_featured: true,
        is_trending: true,
      },
      expectedStatus: 201,
    });

    const meditation4 = await callApi({
      name: 'Create meditation 4 - Focus & Concentration',
      method: 'POST',
      endpoint: '/api/v1/meditations',
      token: adminToken,
      body: {
        title: 'Focus & Concentration',
        subtitle: 'Sharpen your mind',
        description: 'Enhance mental clarity and concentration',
        image_url: 'https://example.com/meditation4.jpg',
        media_url: 'https://example.com/meditation4.mp3',
        duration_seconds: 480,
        difficulty: 'beginner',
        goal_slug: 'focus',
        is_featured: false,
        is_trending: false,
      },
      expectedStatus: 201,
    });

    // 9-12. Create multiple yogas (Admin)
    const yoga1 = await callApi({
      name: 'Create yoga 1 - Morning Flow',
      method: 'POST',
      endpoint: '/api/v1/yogas',
      token: adminToken,
      body: {
        title: 'Morning Flow',
        subtitle: 'Start your day right',
        description: 'Energizing yoga sequence to wake up the body',
        image_url: 'https://example.com/yoga1.jpg',
        media_url: 'https://example.com/yoga1.mp4',
        duration_seconds: 1200,
        difficulty: 'intermediate',
        goal_slug: 'flexibility',
        is_featured: false,
        is_trending: true,
      },
      expectedStatus: 201,
    });

    const yoga2 = await callApi({
      name: 'Create yoga 2 - Power Yoga',
      method: 'POST',
      endpoint: '/api/v1/yogas',
      token: adminToken,
      body: {
        title: 'Power Yoga',
        subtitle: 'Build strength',
        description: 'Challenging vinyasa flow for strength building',
        image_url: 'https://example.com/yoga2.jpg',
        media_url: 'https://example.com/yoga2.mp4',
        duration_seconds: 1800,
        difficulty: 'advanced',
        goal_slug: 'strength',
        is_featured: true,
        is_trending: false,
      },
      expectedStatus: 201,
    });

    const yoga3 = await callApi({
      name: 'Create yoga 3 - Gentle Stretching',
      method: 'POST',
      endpoint: '/api/v1/yogas',
      token: adminToken,
      body: {
        title: 'Gentle Stretching',
        subtitle: 'Relax and unwind',
        description: 'Slow-paced yoga for flexibility and relaxation',
        image_url: 'https://example.com/yoga3.jpg',
        media_url: 'https://example.com/yoga3.mp4',
        duration_seconds: 900,
        difficulty: 'beginner',
        goal_slug: 'better_sleep',
        is_featured: false,
        is_trending: false,
      },
      expectedStatus: 201,
    });

    const yoga4 = await callApi({
      name: 'Create yoga 4 - Chair Yoga',
      method: 'POST',
      endpoint: '/api/v1/yogas',
      token: adminToken,
      body: {
        title: 'Chair Yoga',
        subtitle: 'Accessible practice',
        description: 'Yoga poses adapted for seated practice',
        image_url: 'https://example.com/yoga4.jpg',
        media_url: 'https://example.com/yoga4.mp4',
        duration_seconds: 600,
        difficulty: 'beginner',
        goal_slug: 'flexibility',
        is_featured: true,
        is_trending: true,
      },
      expectedStatus: 201,
    });

    // 13-17. Create multiple mantras (Admin)
    const mantra1 = await callApi({
      name: 'Create mantra 1 - Om',
      method: 'POST',
      endpoint: '/api/v1/mantras',
      token: adminToken,
      body: {
        title: 'Om Chanting',
        subtitle: 'Universal sound',
        description: 'Sacred mantra representing the sound of the universe',
        meaning: 'The primordial sound, representing the essence of reality',
        lyrics: 'Om',
        transliteration: 'Aum',
        pronunciation_guide: 'Pronounce as AUM with three syllables: A-U-M',
        image_url: 'https://example.com/mantra1.jpg',
        audio_url: 'https://example.com/mantra1.mp3',
        difficulty: 'beginner',
        goal_slug: 'spiritual_growth',
        is_featured: true,
        is_trending: false,
      },
      expectedStatus: 201,
    });

    const mantra2 = await callApi({
      name: 'Create mantra 2 - Gayatri',
      method: 'POST',
      endpoint: '/api/v1/mantras',
      token: adminToken,
      body: {
        title: 'Gayatri Mantra',
        subtitle: 'Vedic prayer',
        description: 'Ancient mantra for wisdom and enlightenment',
        meaning: 'Prayer to the divine light for illumination of the intellect',
        lyrics: 'Om Bhur Bhuvaḥ Swaḥ, Tat Savitur Vareṇyaṃ, Bhargo Devasya Dhīmahi, Dhiyo Yo Naḥ Prachodayāt',
        transliteration: 'Om Bhur Bhuvah Svah, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat',
        pronunciation_guide: 'Recite slowly with focus on each syllable',
        image_url: 'https://example.com/mantra2.jpg',
        audio_url: 'https://example.com/mantra2.mp3',
        difficulty: 'intermediate',
        goal_slug: 'focus',
        is_featured: true,
        is_trending: true,
      },
      expectedStatus: 201,
    });

    const mantra3 = await callApi({
      name: 'Create mantra 3 - Shanti',
      method: 'POST',
      endpoint: '/api/v1/mantras',
      token: adminToken,
      body: {
        title: 'Shanti Mantra',
        subtitle: 'Peace invocation',
        description: 'Mantra for inner and outer peace',
        meaning: 'May there be peace in all three realms',
        lyrics: 'Om Shanti Shanti Shanti',
        transliteration: 'Om Shanti Shanti Shanti',
        pronunciation_guide: 'Pronounce Shanti as SHAHN-tee',
        image_url: 'https://example.com/mantra3.jpg',
        audio_url: 'https://example.com/mantra3.mp3',
        difficulty: 'beginner',
        goal_slug: 'stress_relief',
        is_featured: false,
        is_trending: true,
      },
      expectedStatus: 201,
    });

    const mantra4 = await callApi({
      name: 'Create mantra 4 - Maha Mrityunjaya',
      method: 'POST',
      endpoint: '/api/v1/mantras',
      token: adminToken,
      body: {
        title: 'Maha Mrityunjaya Mantra',
        subtitle: 'Great death-conquering mantra',
        description: 'Powerful healing mantra for protection and liberation',
        meaning: 'Victory over death and suffering',
        lyrics: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
        transliteration: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
        pronunciation_guide: 'Chant with devotion and clear pronunciation',
        image_url: 'https://example.com/mantra4.jpg',
        audio_url: 'https://example.com/mantra4.mp3',
        difficulty: 'advanced',
        goal_slug: 'spiritual_growth',
        is_featured: true,
        is_trending: false,
      },
      expectedStatus: 201,
    });

    const mantra5 = await callApi({
      name: 'Create mantra 5 - So Hum',
      method: 'POST',
      endpoint: '/api/v1/mantras',
      token: adminToken,
      body: {
        title: 'So Hum Mantra',
        subtitle: 'I am That',
        description: 'Natural breath mantra for self-realization',
        meaning: 'I am That - unity with the divine',
        lyrics: 'So Hum',
        transliteration: 'So Hum',
        pronunciation_guide: 'Inhale on So, exhale on Hum',
        image_url: 'https://example.com/mantra5.jpg',
        audio_url: 'https://example.com/mantra5.mp3',
        difficulty: 'beginner',
        goal_slug: 'focus',
        is_featured: false,
        is_trending: false,
      },
      expectedStatus: 201,
    });

    // 18. List meditations (public)
    await callApi({
      name: 'List meditations',
      method: 'GET',
      endpoint: '/api/v1/meditations?page=1&limit=10',
      expectedStatus: 200,
    });

    // 19. Get meditation by ID
    await callApi({
      name: 'Get meditation 1 by ID',
      method: 'GET',
      endpoint: `/api/v1/meditations/${meditation1.id}`,
      expectedStatus: 200,
    });

    // 20. List yogas
    await callApi({
      name: 'List yogas',
      method: 'GET',
      endpoint: '/api/v1/yogas',
      expectedStatus: 200,
    });

    // 21. Get yoga by ID
    await callApi({
      name: 'Get yoga 1 by ID',
      method: 'GET',
      endpoint: `/api/v1/yogas/${yoga1.id}`,
      expectedStatus: 200,
    });

    // 22. List mantras
    await callApi({
      name: 'List mantras',
      method: 'GET',
      endpoint: '/api/v1/mantras',
      expectedStatus: 200,
    });

    // 23. Get mantra by ID
    await callApi({
      name: 'Get mantra 1 by ID',
      method: 'GET',
      endpoint: `/api/v1/mantras/${mantra1.id}`,
      expectedStatus: 200,
    });

    // 24-26. Save multiple meditations (user)
    await callApi({
      name: 'Save meditation 1',
      method: 'POST',
      endpoint: '/api/v1/me/saved-meditations',
      token: userToken,
      body: { meditation_id: meditation1.id },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Save meditation 2',
      method: 'POST',
      endpoint: '/api/v1/me/saved-meditations',
      token: userToken,
      body: { meditation_id: meditation2.id },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Save meditation 3',
      method: 'POST',
      endpoint: '/api/v1/me/saved-meditations',
      token: userToken,
      body: { meditation_id: meditation3.id },
      expectedStatus: 200,
    });

    // 27. Get saved meditations
    await callApi({
      name: 'Get saved meditations',
      method: 'GET',
      endpoint: '/api/v1/me/saved-meditations',
      token: userToken,
      expectedStatus: 200,
    });

    // 28-30. Save multiple yogas
    await callApi({
      name: 'Save yoga 1',
      method: 'POST',
      endpoint: '/api/v1/me/saved-yogas',
      token: userToken,
      body: { yoga_id: yoga1.id },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Save yoga 2',
      method: 'POST',
      endpoint: '/api/v1/me/saved-yogas',
      token: userToken,
      body: { yoga_id: yoga2.id },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Save yoga 3',
      method: 'POST',
      endpoint: '/api/v1/me/saved-yogas',
      token: userToken,
      body: { yoga_id: yoga3.id },
      expectedStatus: 200,
    });

    // 31. Get saved yogas
    await callApi({
      name: 'Get saved yogas',
      method: 'GET',
      endpoint: '/api/v1/me/saved-yogas',
      token: userToken,
      expectedStatus: 200,
    });

    // 32-35. Save multiple mantras
    await callApi({
      name: 'Save mantra 1',
      method: 'POST',
      endpoint: '/api/v1/me/saved-mantras',
      token: userToken,
      body: { mantra_id: mantra1.id },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Save mantra 2',
      method: 'POST',
      endpoint: '/api/v1/me/saved-mantras',
      token: userToken,
      body: { mantra_id: mantra2.id },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Save mantra 3',
      method: 'POST',
      endpoint: '/api/v1/me/saved-mantras',
      token: userToken,
      body: { mantra_id: mantra3.id },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Save mantra 4',
      method: 'POST',
      endpoint: '/api/v1/me/saved-mantras',
      token: userToken,
      body: { mantra_id: mantra4.id },
      expectedStatus: 200,
    });

    // 36. Get saved mantras
    await callApi({
      name: 'Get saved mantras',
      method: 'GET',
      endpoint: '/api/v1/me/saved-mantras',
      token: userToken,
      expectedStatus: 200,
    });

    // 37-40. Upsert meditation progress for multiple items
    await callApi({
      name: 'Upsert meditation 1 progress',
      method: 'POST',
      endpoint: '/api/v1/me/meditation-progress',
      token: userToken,
      body: {
        meditation_id: meditation1.id,
        progress_percent: 50,
        last_position_seconds: 300,
        status: 'in_progress',
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert meditation 2 progress - completed',
      method: 'POST',
      endpoint: '/api/v1/me/meditation-progress',
      token: userToken,
      body: {
        meditation_id: meditation2.id,
        progress_percent: 100,
        last_position_seconds: 900,
        status: 'completed',
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert meditation 3 progress - just started',
      method: 'POST',
      endpoint: '/api/v1/me/meditation-progress',
      token: userToken,
      body: {
        meditation_id: meditation3.id,
        progress_percent: 10,
        last_position_seconds: 120,
        status: 'in_progress',
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert meditation 4 progress',
      method: 'POST',
      endpoint: '/api/v1/me/meditation-progress',
      token: userToken,
      body: {
        meditation_id: meditation4.id,
        progress_percent: 75,
        last_position_seconds: 360,
        status: 'in_progress',
      },
      expectedStatus: 200,
    });

    // 41. Get meditation progress
    await callApi({
      name: 'Get meditation progress',
      method: 'GET',
      endpoint: '/api/v1/me/meditation-progress',
      token: userToken,
      expectedStatus: 200,
    });

    // 42-45. Upsert yoga progress for multiple items
    await callApi({
      name: 'Upsert yoga 1 progress - completed',
      method: 'POST',
      endpoint: '/api/v1/me/yoga-progress',
      token: userToken,
      body: {
        yoga_id: yoga1.id,
        progress_percent: 100,
        last_position_seconds: 1200,
        status: 'completed',
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert yoga 2 progress - halfway',
      method: 'POST',
      endpoint: '/api/v1/me/yoga-progress',
      token: userToken,
      body: {
        yoga_id: yoga2.id,
        progress_percent: 50,
        last_position_seconds: 900,
        status: 'in_progress',
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert yoga 3 progress',
      method: 'POST',
      endpoint: '/api/v1/me/yoga-progress',
      token: userToken,
      body: {
        yoga_id: yoga3.id,
        progress_percent: 30,
        last_position_seconds: 270,
        status: 'in_progress',
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert yoga 4 progress - completed',
      method: 'POST',
      endpoint: '/api/v1/me/yoga-progress',
      token: userToken,
      body: {
        yoga_id: yoga4.id,
        progress_percent: 100,
        last_position_seconds: 600,
        status: 'completed',
      },
      expectedStatus: 200,
    });

    // 46. Get yoga progress
    await callApi({
      name: 'Get yoga progress',
      method: 'GET',
      endpoint: '/api/v1/me/yoga-progress',
      token: userToken,
      expectedStatus: 200,
    });

    // 47-51. Upsert mantra progress for multiple items
    await callApi({
      name: 'Upsert mantra 1 progress',
      method: 'POST',
      endpoint: '/api/v1/me/mantra-progress',
      token: userToken,
      body: {
        mantra_id: mantra1.id,
        times_practiced: 10,
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert mantra 2 progress',
      method: 'POST',
      endpoint: '/api/v1/me/mantra-progress',
      token: userToken,
      body: {
        mantra_id: mantra2.id,
        times_practiced: 25,
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert mantra 3 progress',
      method: 'POST',
      endpoint: '/api/v1/me/mantra-progress',
      token: userToken,
      body: {
        mantra_id: mantra3.id,
        times_practiced: 5,
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert mantra 4 progress',
      method: 'POST',
      endpoint: '/api/v1/me/mantra-progress',
      token: userToken,
      body: {
        mantra_id: mantra4.id,
        times_practiced: 15,
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Upsert mantra 5 progress',
      method: 'POST',
      endpoint: '/api/v1/me/mantra-progress',
      token: userToken,
      body: {
        mantra_id: mantra5.id,
        times_practiced: 8,
      },
      expectedStatus: 200,
    });

    // 52. Get mantra progress
    await callApi({
      name: 'Get mantra progress',
      method: 'GET',
      endpoint: '/api/v1/me/mantra-progress',
      token: userToken,
      expectedStatus: 200,
    });

    // 53-56. Create meditation reviews (schema: /api/v1/meditations/{id}/reviews)
    const medReview1 = await callApi({
      name: 'Create meditation 1 review',
      method: 'POST',
      endpoint: `/api/v1/meditations/${meditation1.id}/reviews`,
      token: userToken,
      body: {
        rating: 5,
        comment: 'Excellent meditation session! Very calming and relaxing.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create meditation 2 review',
      method: 'POST',
      endpoint: `/api/v1/meditations/${meditation2.id}/reviews`,
      token: userToken,
      body: {
        rating: 4,
        comment: 'Great body scan, helped me release tension.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create meditation 3 review',
      method: 'POST',
      endpoint: `/api/v1/meditations/${meditation3.id}/reviews`,
      token: userToken,
      body: {
        rating: 5,
        comment: 'Beautiful loving kindness practice. Very heart-opening.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create meditation 4 review',
      method: 'POST',
      endpoint: `/api/v1/meditations/${meditation4.id}/reviews`,
      token: userToken,
      body: {
        rating: 4,
        comment: 'Helpful for concentration, though could be longer.',
      },
      expectedStatus: 201,
    });

    // 57. Get meditation 1 reviews
    await callApi({
      name: 'Get meditation 1 reviews',
      method: 'GET',
      endpoint: `/api/v1/meditations/${meditation1.id}/reviews`,
      expectedStatus: 200,
    });

    // 58. Update meditation 1 review (schema: PATCH not PUT)
    await callApi({
      name: 'Update meditation 1 review',
      method: 'PATCH',
      endpoint: `/api/v1/meditations/${meditation1.id}/reviews/${medReview1.id}`,
      token: userToken,
      body: {
        rating: 4,
        comment: 'Good, but could be longer. Still very helpful.',
      },
      expectedStatus: 200,
    });

    // 59-62. Create yoga reviews (schema: /api/v1/yogas/{id}/reviews)
    await callApi({      name: 'Create yoga 1 review',
      method: 'POST',
      endpoint: `/api/v1/yogas/${yoga1.id}/reviews`,
      token: userToken,
      body: {
        rating: 5,
        comment: 'Perfect morning routine! Energized me for the day.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create yoga 2 review',
      method: 'POST',
      endpoint: `/api/v1/yogas/${yoga2.id}/reviews`,
      token: userToken,
      body: {
        rating: 4,
        comment: 'Challenging but rewarding power yoga session.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create yoga 3 review',
      method: 'POST',
      endpoint: `/api/v1/yogas/${yoga3.id}/reviews`,
      token: userToken,
      body: {
        rating: 5,
        comment: 'So relaxing before bed. Helped me sleep better.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create yoga 4 review',
      method: 'POST',
      endpoint: `/api/v1/yogas/${yoga4.id}/reviews`,
      token: userToken,
      body: {
        rating: 5,
        comment: 'Great accessible practice for everyone!',
      },
      expectedStatus: 201,
    });

    // 63. Get yoga 1 reviews
    await callApi({
      name: 'Get yoga 1 reviews',
      method: 'GET',
      endpoint: `/api/v1/yogas/${yoga1.id}/reviews`,
      expectedStatus: 200,
    });

    // 64-68. Create mantra reviews (schema: /api/v1/mantras/{id}/reviews)
    await callApi({
      name: 'Create mantra 1 review',
      method: 'POST',
      endpoint: `/api/v1/mantras/${mantra1.id}/reviews`,
      token: userToken,
      body: {
        rating: 5,
        comment: 'Very peaceful and centering. Perfect for beginners.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create mantra 2 review',
      method: 'POST',
      endpoint: `/api/v1/mantras/${mantra2.id}/reviews`,
      token: userToken,
      body: {
        rating: 5,
        comment: 'Powerful and enlightening mantra. Improves focus.',
      },
      expectedStatus: 201,
    });

    const mantraReview3 = await callApi({
      name: 'Create mantra 3 review',
      method: 'POST',
      endpoint: `/api/v1/mantras/${mantra3.id}/reviews`,
      token: userToken,
      body: {
        rating: 4,
        comment: 'Simple yet effective peace mantra.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create mantra 4 review',
      method: 'POST',
      endpoint: `/api/v1/mantras/${mantra4.id}/reviews`,
      token: userToken,
      body: {
        rating: 5,
        comment: 'Transformative healing mantra. Very powerful.',
      },
      expectedStatus: 201,
    });

    await callApi({
      name: 'Create mantra 5 review',
      method: 'POST',
      endpoint: `/api/v1/mantras/${mantra5.id}/reviews`,
      token: userToken,
      body: {
        rating: 4,
        comment: 'Natural breath awareness. Very grounding.',
      },
      expectedStatus: 201,
    });

    // 69. Get mantra 1 reviews
    await callApi({
      name: 'Get mantra 1 reviews',
      method: 'GET',
      endpoint: `/api/v1/mantras/${mantra1.id}/reviews`,
      expectedStatus: 200,
    });

    // 70-72. Update multiple items (Admin) - schema: PATCH not PUT
    await callApi({
      name: 'Update meditation 1',
      method: 'PATCH',
      endpoint: `/api/v1/meditations/${meditation1.id}`,
      token: adminToken,
      body: {
        title: 'Mindful Breathing - Updated',
        is_trending: true,
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Update yoga 1',
      method: 'PATCH',
      endpoint: `/api/v1/yogas/${yoga1.id}`,
      token: adminToken,
      body: {
        title: 'Morning Flow - Enhanced',
      },
      expectedStatus: 200,
    });

    await callApi({
      name: 'Update mantra 1',
      method: 'PATCH',
      endpoint: `/api/v1/mantras/${mantra1.id}`,
      token: adminToken,
      body: {
        title: 'Om Chanting - Extended',
      },
      expectedStatus: 200,
    });

    // 73-74. Unsave some items
    await callApi({
      name: 'Unsave meditation 2',
      method: 'DELETE',
      endpoint: `/api/v1/me/saved-meditations/${meditation2.id}`,
      token: userToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Unsave yoga 2',
      method: 'DELETE',
      endpoint: `/api/v1/me/saved-yogas/${yoga2.id}`,
      token: userToken,
      expectedStatus: 200,
    });

    // 75-76. Delete some reviews (schema: DELETE /api/v1/{content}/{id}/reviews/:review_id)
    await callApi({
      name: 'Delete meditation 1 review',
      method: 'DELETE',
      endpoint: `/api/v1/meditations/${meditation1.id}/reviews/${medReview1.id}`,
      token: userToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Delete mantra 3 review',
      method: 'DELETE',
      endpoint: `/api/v1/mantras/${mantra3.id}/reviews/${mantraReview3.id}`,
      token: userToken,
      expectedStatus: 200,
    });

    // 77-79. Delete some content (Admin) - soft delete
    await callApi({
      name: 'Delete meditation 4',
      method: 'DELETE',
      endpoint: `/api/v1/meditations/${meditation4.id}`,
      token: adminToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Delete yoga 4',
      method: 'DELETE',
      endpoint: `/api/v1/yogas/${yoga4.id}`,
      token: adminToken,
      expectedStatus: 200,
    });

    await callApi({
      name: 'Delete mantra 5',
      method: 'DELETE',
      endpoint: `/api/v1/mantras/${mantra5.id}`,
      token: adminToken,
      expectedStatus: 200,
    });


    const passed = output.steps.filter((x) => x.ok).length;
    const failed = output.steps.length - passed;
    const successRate = ((passed / output.steps.length) * 100).toFixed(1);

    output.summary = { 
      total: output.steps.length,
      passed,
      failed,
      success_rate: `${successRate}%`,
    };
    output.finished_at = new Date().toISOString();

    const reportPath = path.resolve(process.cwd(), 'live-api-test-output.json');
    fs.writeFileSync(reportPath, JSON.stringify(output, null, 2), 'utf-8');

    console.log('\n\n=== TEST SUMMARY ===');
    console.log(`Total Steps: ${output.steps.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log(`\nTest results written to: ${reportPath}`);

    // Show created collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\nDB Collections created (${collections.length} total):`);
    console.log(collections.map(c => c.name).join(', '));

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

    console.error('\n\n=== LIVE API TEST FAILED ===');
    console.error(error);
    console.error(`\nPartial report written to: ${reportPath}`);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(() => resolve()));
    }
    await disconnectDatabase();
  }
}

main();
