/* eslint-disable no-console */
require('dotenv').config();

const { connectDatabase, disconnectDatabase } = require('../dist/database/mongodb');
const { LibraryItemModel } = require('../dist/models/library-item.model');

const paragraph =
  'This section explains practical steps, mindset adjustments, and consistent routines that help practitioners build depth over time. The focus is on breath quality, steady posture, and sustainable progression rather than intensity alone. When repeated daily, these principles improve clarity, emotional stability, and long-term adherence to mindful practice.';

const longRead = (...parts) => {
  return [
    ...parts,
    paragraph,
    paragraph,
    'To apply this in daily life, choose one small objective per week, track it honestly, and refine based on reflection. Avoid perfectionism and aim for continuity. A calm and repeatable rhythm is more transformative than occasional extremes.',
  ].join('\n\n');
};

const uploadedPdf = (name) => `/uploads/documents/${name}`;

const LIBRARY_ITEMS = [
  {
    library_type: 'book',
    title: 'Light on Yoga',
    author_name: 'B.K.S. Iyengar',
    description: 'A foundational yoga text covering philosophy, postures, and disciplined practice.',
    content_text: longRead(
      'Light on Yoga introduces classical foundations and systematically links posture work with awareness, discipline, and ethical orientation.',
      'Use this as a companion for weekly posture progression, breathing consistency, and reflective learning after each practice.'
    ),
    read_minutes: 18,
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('light-on-yoga-expanded-guide.pdf'),
    category_slug: 'yoga',
    is_featured: true,
    is_active: true,
  },
  {
    library_type: 'book',
    title: 'Autobiography of a Yogi',
    author_name: 'Paramahansa Yogananda',
    description: 'A spiritual memoir introducing yogic philosophy and meditative living.',
    content_text: longRead(
      'Autobiography of a Yogi frames inner growth through devotion, concentration, and disciplined self-observation.',
      'Readers can use these teachings to strengthen regular meditation and value-based decision making in everyday life.'
    ),
    read_minutes: 14,
    cover_image_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('autobiography-of-a-yogi-reading-notes.pdf'),
    category_slug: 'philosophy',
    is_featured: false,
    is_active: true,
  },
  {
    library_type: 'book',
    title: 'The Heart of Yoga',
    author_name: 'T.K.V. Desikachar',
    description: 'A practical guide to adapting yoga for individual needs and health goals.',
    content_text: longRead(
      'The Heart of Yoga emphasizes adaptation: practice should match the person, not force the person to match a rigid template.',
      'Breath-led sequencing, gradual progression, and intentional rest create a safer and more meaningful long-term journey.'
    ),
    read_minutes: 12,
    cover_image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('heart-of-yoga-personal-practice.pdf'),
    category_slug: 'yoga',
    is_featured: false,
    is_active: true,
  },
  {
    library_type: 'article',
    title: 'Breath and Nervous System Reset',
    author_name: 'Tridivya Editorial',
    description: 'How slow breathing helps regulate stress and improve emotional balance.',
    content_text: longRead(
      'Breath pacing directly influences nervous system regulation. Longer exhalations help reduce physiological over-arousal and improve attention span.',
      'A short daily protocol can improve recovery from stress, transitions between tasks, and emotional steadiness during difficult conversations.'
    ),
    read_minutes: 6,
    cover_image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('breath-nervous-system-reset-protocol.pdf'),
    category_slug: 'meditation',
    is_featured: true,
    is_active: true,
  },
  {
    library_type: 'article',
    title: '5-Minute Desk Yoga Sequence',
    author_name: 'Tridivya Editorial',
    description: 'A short mobility routine for neck, shoulders, and lower back during work.',
    content_text: longRead(
      'Desk yoga is most effective when done consistently in short intervals rather than rarely in long blocks.',
      'The sequence prioritizes neck decompression, thoracic mobility, and hip reset to reduce fatigue from prolonged sitting.'
    ),
    read_minutes: 5,
    cover_image_url: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('desk-yoga-sequence-office-practice.pdf'),
    category_slug: 'yoga',
    is_featured: false,
    is_active: true,
  },
  {
    library_type: 'article',
    title: 'Evening Wind-Down Meditation',
    author_name: 'Tridivya Editorial',
    description: 'A guided structure for calming the mind before sleep.',
    content_text: longRead(
      'Evening meditation benefits from a predictable structure: breath count, body scan, release cues, and a short gratitude close.',
      'This method reduces cognitive carryover from daytime stress and supports sleep readiness without forcing immediate stillness.'
    ),
    read_minutes: 7,
    cover_image_url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('evening-meditation-sleep-readiness.pdf'),
    category_slug: 'meditation',
    is_featured: false,
    is_active: true,
  },
  {
    library_type: 'resource',
    title: 'Beginner Yoga Checklist',
    author_name: 'Tridivya Team',
    description: 'Simple weekly checklist for posture, breathing, and consistency goals.',
    content_text: longRead(
      'A practical checklist keeps beginners focused on consistency, not complexity.',
      'Track session completion, perceived breath smoothness, and post-practice state to identify what supports progress.'
    ),
    read_minutes: 4,
    cover_image_url: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('beginner-yoga-checklist-template.pdf'),
    category_slug: 'yoga',
    is_featured: false,
    is_active: true,
  },
  {
    library_type: 'resource',
    title: 'Meditation Habit Tracker',
    author_name: 'Tridivya Team',
    description: 'Template to build a 21-day meditation habit with reflection notes.',
    content_text: longRead(
      'Habit tracking strengthens meditation by making consistency visible and measurable.',
      'Use short daily entries for duration, distraction intensity, and emotional shift before/after to detect meaningful trends.'
    ),
    read_minutes: 4,
    cover_image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('meditation-habit-tracker-guide.pdf'),
    category_slug: 'meditation',
    is_featured: false,
    is_active: true,
  },
  {
    library_type: 'resource',
    title: 'Mindful Nutrition Notes',
    author_name: 'Tridivya Team',
    description: 'Quick reference for sattvic meal patterns and hydration timing.',
    content_text: longRead(
      'Mindful nutrition supports yoga and meditation outcomes by stabilizing energy and reducing reactivity from irregular eating patterns.',
      'Simple meal rhythm, hydration timing, and gentle evening choices improve focus quality and restorative sleep.'
    ),
    read_minutes: 6,
    cover_image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('mindful-nutrition-sattvic-notes.pdf'),
    category_slug: 'philosophy',
    is_featured: false,
    is_active: true,
  },
  {
    library_type: 'article',
    title: 'Posture and Breath for Long Sitting',
    author_name: 'Tridivya Editorial',
    description: 'How to sit comfortably for reading, chanting, and meditation.',
    content_text: longRead(
      'Stable sitting posture is built from balanced support, not rigid tension. Elevate hips slightly and lengthen spine without overextending the lower back.',
      'Frequent micro-resets maintain comfort and alertness during long reading or chanting sessions.'
    ),
    read_minutes: 5,
    cover_image_url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=600&q=80',
    content_url: uploadedPdf('posture-breath-long-sitting-manual.pdf'),
    category_slug: 'yoga',
    is_featured: false,
    is_active: true,
  },
];

async function upsertByTitle(items) {
  for (const item of items) {
    const saved = await LibraryItemModel.findOneAndUpdate(
      { title: item.title },
      { $set: item },
      { new: true, upsert: true }
    );
    console.log(`[library] upserted: ${saved.title} (${saved.id})`);
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  await connectDatabase(mongoUri);
  console.log('Connected to DB');

  await upsertByTitle(LIBRARY_ITEMS);

  console.log(`Done: seeded ${LIBRARY_ITEMS.length} library items.`);
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
