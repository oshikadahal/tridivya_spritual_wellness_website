/* eslint-disable no-console */
require('dotenv').config();

const { connectDatabase, disconnectDatabase } = require('../dist/database/mongodb');
const { YogaModel } = require('../dist/models/yoga.model');
const { MeditationModel } = require('../dist/models/meditation.model');
const { MantraModel } = require('../dist/models/mantra.model');

const PUBLIC_BASE_URL = 'http://127.0.0.1:5050';

const buildPublicUploadUrl = (folder, fileName) => {
  const encodedFileName = encodeURIComponent(fileName);
  return `${PUBLIC_BASE_URL}/uploads/${folder}/${encodedFileName}`;
};

const yogaItems = [
  {
    title: 'Gentle Morning Flow',
    subtitle: 'Start your day with breath and movement',
    description: 'A simple yoga sequence to improve flexibility, posture, and calm focus.',
    difficulty: 'beginner',
    duration_seconds: 1200,
    goal_slug: 'daily-balance',
    accent_label: 'Mobility',
    image_url: buildPublicUploadUrl('images', 'Gentle morning flow.jpg'),
    thumbnail_url: buildPublicUploadUrl('images', 'Gentle morning flow.jpg'),
    cover_image_url: buildPublicUploadUrl('images', 'Gentle morning flow.jpg'),
    media_url: buildPublicUploadUrl('video', 'Morning Yoga Flow    20-Minute Morning Yoga Practice - Yoga With Adriene (720p, h264).mp4'),
    is_featured: true,
    is_trending: true,
    is_active: true,
  },
  {
    title: 'Power Yoga Session',
    subtitle: 'Strength and stamina practice',
    description: 'A dynamic yoga flow for strength, energy, and body control.',
    difficulty: 'intermediate',
    duration_seconds: 1200,
    goal_slug: 'strength-and-focus',
    accent_label: 'Strength',
    image_url: buildPublicUploadUrl('images', 'Power Yoga.jpg'),
    thumbnail_url: buildPublicUploadUrl('images', 'Power Yoga.jpg'),
    cover_image_url: buildPublicUploadUrl('images', 'Power Yoga.jpg'),
    media_url: buildPublicUploadUrl('video', 'power yoga.mp4'),
    is_featured: false,
    is_trending: true,
    is_active: true,
  },
];

const meditationItems = [
  {
    title: 'Body Scan Meditation',
    subtitle: 'Relax from head to toe',
    description: 'A guided body scan to release tension and improve awareness.',
    difficulty: 'beginner',
    duration_seconds: 900,
    goal_slug: 'stress-relief',
    accent_label: 'Calm',
    image_url: buildPublicUploadUrl('images', 'Body Scan Meditation.jpg'),
    thumbnail_url: buildPublicUploadUrl('images', 'Body Scan Meditation.jpg'),
    cover_image_url: buildPublicUploadUrl('images', 'Body Scan Meditation.jpg'),
    media_url: buildPublicUploadUrl('video', 'Body Scan Meditation.mp4'),
    is_featured: true,
    is_trending: false,
    is_active: true,
  },
  {
    title: 'Loving Kindness Meditation',
    subtitle: 'Cultivate compassion and ease',
    description: 'A heart-centered meditation that builds warmth, empathy, and emotional balance.',
    difficulty: 'all_levels',
    duration_seconds: 780,
    goal_slug: 'emotional-balance',
    accent_label: 'Compassion',
    image_url: buildPublicUploadUrl('images', 'Loving Kindness Meditation.jpg'),
    thumbnail_url: buildPublicUploadUrl('images', 'Loving Kindness Meditation.jpg'),
    cover_image_url: buildPublicUploadUrl('images', 'Loving Kindness Meditation.jpg'),
    media_url: buildPublicUploadUrl('video', 'Loving Kindness Meditation.mp4'),
    is_featured: false,
    is_trending: true,
    is_active: true,
  },
];

const mantraItems = [
  {
    title: 'Morning Clarity Chant',
    meaning: 'A mantra for clear thinking and centered energy at the start of the day.',
    lyrics: 'Om Bhur Bhuvah Swaha',
    transliteration: 'Om Bhur Bhuvah Swaha',
    pronunciation_guide: 'OHM BHOOR BHOO-vah SWAA-ha',
    duration_seconds: 300,
    image_url: buildPublicUploadUrl('images', 'Morning Clarity Chant.jpg'),
    thumbnail_url: buildPublicUploadUrl('images', 'Morning Clarity Chant.jpg'),
    cover_image_url: buildPublicUploadUrl('images', 'Morning Clarity Chant.jpg'),
    audio_url: buildPublicUploadUrl('audio', 'Morning Clarity Chant.mp3'),
    is_featured: true,
    is_trending: true,
    is_active: true,
  },
  {
    title: 'Shanti Mantra',
    meaning: 'A peace mantra traditionally chanted for harmony and inner stillness.',
    lyrics: 'Om Shanti Shanti Shanti',
    transliteration: 'Om Shanti Shanti Shanti',
    pronunciation_guide: 'OHM SHAN-tee SHAN-tee SHAN-tee',
    duration_seconds: 260,
    image_url: buildPublicUploadUrl('images', 'Shanti Mantra.jpg'),
    thumbnail_url: buildPublicUploadUrl('images', 'Shanti Mantra.jpg'),
    cover_image_url: buildPublicUploadUrl('images', 'Shanti Mantra.jpg'),
    audio_url: buildPublicUploadUrl('audio', 'Shanti Mantra.mp3'),
    is_featured: false,
    is_trending: true,
    is_active: true,
  },
];

async function upsertByTitle(model, items, label) {
  for (const item of items) {
    const saved = await model.findOneAndUpdate(
      { title: item.title },
      {
        $set: {
          ...item,
          metadata: {
            source: 'seed-media-content.js',
            public_base_url: PUBLIC_BASE_URL,
          },
        },
      },
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

  await upsertByTitle(YogaModel, yogaItems, 'yoga');
  await upsertByTitle(MeditationModel, meditationItems, 'meditation');
  await upsertByTitle(MantraModel, mantraItems, 'mantra');

  console.log('Done: yoga + meditation videos and mantra audios seeded with public upload URLs.');
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
