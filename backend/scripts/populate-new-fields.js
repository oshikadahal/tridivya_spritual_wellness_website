/* eslint-disable no-console */
require('dotenv').config();
const { connectDatabase, disconnectDatabase } = require('../dist/database/mongodb');
const { UserModel } = require('../dist/models/user.model');
const { MantraModel } = require('../dist/models/mantra.model');
const { LibraryItemModel } = require('../dist/models/library-item.model');
const { SavedMantraModel } = require('../dist/models/saved-mantra.model');
const { SavedLibraryItemModel } = require('../dist/models/saved-library-item.model');

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  await connectDatabase(mongoUri);
  console.log('Connected to DB');

  // pick an existing normal user (fallback to any user)
  let user = await UserModel.findOne({ role: 'user' }).lean();
  if (!user) user = await UserModel.findOne().lean();
  if (!user) throw new Error('No user available in users collection to assign saved records');
  const user_id = user.id || user._id?.toString();

  // Insert new mantras with cover_image_url
  const mantras = [
    {
      title: 'Nava Shakti',
      meaning: 'Renewed energy',
      lyrics: 'Nava Shakti Om',
      transliteration: 'Nava Shakti',
      pronunciation_guide: 'NAH-vah SHAHK-tee',
      duration_seconds: 180,
      thumbnail_url: 'https://example.com/mantra-nava-thumb.jpg',
      cover_image_url: 'https://example.com/mantra-nava-cover.jpg',
      audio_url: 'https://example.com/mantra-nava.mp3',
      is_featured: false,
      is_trending: false,
    },
    {
      title: 'Shanti Dua',
      meaning: 'Peace offering',
      lyrics: 'Om Shanti Dua',
      transliteration: 'Shanti Dua',
      pronunciation_guide: 'SHAN-tee DOO-ah',
      duration_seconds: 240,
      thumbnail_url: 'https://example.com/mantra-shanti-thumb.jpg',
      cover_image_url: 'https://example.com/mantra-shanti-cover.jpg',
      audio_url: 'https://example.com/mantra-shanti.mp3',
      is_featured: true,
      is_trending: false,
    },
  ];

  const createdMantras = [];
  for (const m of mantras) {
    const doc = new MantraModel(m);
    const saved = await doc.save();
    createdMantras.push(saved);
    console.log('Inserted mantra', saved.id);
  }

  // Insert new library items with content_url
  const libraries = [
    {
      library_type: 'article',
      title: 'Breathwork Basics',
      author_name: 'A. Teacher',
      description: 'Intro to pranayama and breath techniques',
      read_minutes: 8,
      cover_image_url: 'https://example.com/library-breath-cover.jpg',
      content_url: 'https://example.com/articles/breathwork-basics.html',
      thumbnail_url: 'https://example.com/library-breath-thumb.jpg',
      is_featured: false,
    },
    {
      library_type: 'book',
      title: 'The Quiet Mind',
      author_name: 'S. Monk',
      description: 'A short guide to mindful living',
      read_minutes: 120,
      cover_image_url: 'https://example.com/library-quiet-cover.jpg',
      content_url: 'https://example.com/books/the-quiet-mind.epub',
      thumbnail_url: 'https://example.com/library-quiet-thumb.jpg',
      is_featured: true,
    },
  ];

  const createdLibraries = [];
  for (const it of libraries) {
    const doc = new LibraryItemModel(it);
    const saved = await doc.save();
    createdLibraries.push(saved);
    console.log('Inserted library item', saved.id);
  }

  // Create saved records for the user for one mantra and one library item
  if (createdMantras.length) {
    await SavedMantraModel.findOneAndUpdate(
      { user_id, mantra_id: createdMantras[0].id },
      { user_id, mantra_id: createdMantras[0].id, saved_at: new Date() },
      { upsert: true }
    );
    console.log('Saved mantra for user', user_id, createdMantras[0].id);
  }

  if (createdLibraries.length) {
    await SavedLibraryItemModel.findOneAndUpdate(
      { user_id, library_item_id: createdLibraries[0].id },
      { user_id, library_item_id: createdLibraries[0].id, saved_at: new Date() },
      { upsert: true }
    );
    console.log('Saved library item for user', user_id, createdLibraries[0].id);
  }

  console.log('Done inserting sample records.');
  await disconnectDatabase();
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
