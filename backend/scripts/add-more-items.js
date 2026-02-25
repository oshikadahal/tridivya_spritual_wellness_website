/* eslint-disable no-console */
require('dotenv').config();

const { connectDatabase, disconnectDatabase } = require('../dist/database/mongodb');
const { MantraModel } = require('../dist/models/mantra.model');
const { YogaModel } = require('../dist/models/yoga.model');

const AUDIO_URL = '/uploads/audio/gyatri%20mantra.mp3';
const VIDEO_URL = '/uploads/videos/video.mp4';
const THUMBNAIL_URL = '/uploads/imageUrl-58f6f189-09a7-456c-ad64-14f28e38bb4f.jpeg';

const MANTRA_ITEMS = [
  {
    title: 'Morning Clarity Chant',
    meaning: 'A mantra to start the day with focus and calm.',
    lyrics: 'Om Bhur Bhuvah Swaha',
    transliteration: 'Om Bhur Bhuvah Swaha',
    pronunciation_guide: 'OHM BHOOR BHOO-vah SWAA-ha',
    duration_seconds: 210,
    thumbnail_url: THUMBNAIL_URL,
    cover_image_url: THUMBNAIL_URL,
    audio_url: AUDIO_URL,
    is_featured: false,
    is_trending: true,
    is_active: true,
  },
  {
    title: 'Evening Peace Mantra',
    meaning: 'A soothing mantra for winding down in the evening.',
    lyrics: 'Om Shanti Shanti Shanti',
    transliteration: 'Om Shanti Shanti Shanti',
    pronunciation_guide: 'OHM SHAN-tee SHAN-tee SHAN-tee',
    duration_seconds: 240,
    thumbnail_url: THUMBNAIL_URL,
    cover_image_url: THUMBNAIL_URL,
    audio_url: AUDIO_URL,
    is_featured: true,
    is_trending: false,
    is_active: true,
  },
];

const YOGA_ITEMS = [
  {
    title: 'Gentle Morning Flow',
    subtitle: 'Wake up your body with a mindful sequence',
    description: 'A beginner-friendly yoga flow focused on breath and mobility.',
    difficulty: 'beginner',
    duration_seconds: 900,
    thumbnail_url: THUMBNAIL_URL,
    cover_image_url: THUMBNAIL_URL,
    media_url: VIDEO_URL,
    goal_slug: 'daily-balance',
    is_featured: true,
    is_trending: true,
    is_active: true,
  },
  {
    title: 'Core Stability Practice',
    subtitle: 'Build strength and posture control',
    description: 'An intermediate routine to improve core endurance and alignment.',
    difficulty: 'intermediate',
    duration_seconds: 1200,
    thumbnail_url: THUMBNAIL_URL,
    cover_image_url: THUMBNAIL_URL,
    media_url: VIDEO_URL,
    goal_slug: 'strength-and-focus',
    is_featured: false,
    is_trending: true,
    is_active: true,
  },
];

async function upsertItems(model, items, label) {
  for (const item of items) {
    const saved = await model.findOneAndUpdate(
      { title: item.title },
      { $set: item },
      { new: true, upsert: true }
    );
    console.log(`[${label}] upserted: ${saved.title} (${saved.id})`);
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  await connectDatabase(mongoUri);
  console.log('Connected to DB');

  await upsertItems(MantraModel, MANTRA_ITEMS, 'mantra');
  await upsertItems(YogaModel, YOGA_ITEMS, 'yoga');

  console.log('Done: additional content items inserted using one audio and one video file.');
  await disconnectDatabase();
}

main().catch(async (error) => {
  console.error('Failed:', error);
  try {
    await disconnectDatabase();
  } catch {
    // ignore disconnect errors on failure path
  }
  process.exit(1);
});
