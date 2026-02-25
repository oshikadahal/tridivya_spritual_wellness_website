import request from 'supertest';
import app from '../../src/app';
import { MeditationModel } from '../../src/models/meditation.model';
import { YogaModel } from '../../src/models/yoga.model';
import { MantraModel } from '../../src/models/mantra.model';

describe('Search API Integration', () => {
  beforeAll(async () => {
    const unique = Date.now();

    await MeditationModel.create({
      title: `Meditation ${unique}`,
      description: 'Guided calm practice',
      image_url: 'https://example.com/meditation.jpg',
      media_url: 'https://example.com/meditation.mp4',
      duration_seconds: 600,
      difficulty: 'beginner',
      goal_slug: 'stress-relief',
      is_featured: true,
      is_trending: true,
      is_active: true,
    });

    await YogaModel.create({
      title: `Yoga ${unique}`,
      description: 'Morning flow session',
      image_url: 'https://example.com/yoga.jpg',
      media_url: 'https://example.com/yoga.mp4',
      duration_seconds: 900,
      difficulty: 'intermediate',
      goal_slug: 'focus',
      is_featured: false,
      is_trending: true,
      is_active: true,
    });

    await MantraModel.create({
      title: `Mantra ${unique}`,
      meaning: 'Calm and clarity',
      is_featured: false,
      is_trending: true,
      is_active: true,
    });
  });

  afterAll(async () => {
    await MeditationModel.deleteMany({ title: /Meditation \d+/ });
    await YogaModel.deleteMany({ title: /Yoga \d+/ });
    await MantraModel.deleteMany({ title: /Mantra \d+/ });
  });

  it('searches content by query', async () => {
    const response = await request(app).get('/api/search/content?q=meditation');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('returns suggestions', async () => {
    const response = await request(app).get('/api/search/suggestions?q=man');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('returns filter options', async () => {
    const response = await request(app).get('/api/search/filters');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.difficulties).toBeDefined();
    expect(response.body.data.contentTypes).toBeDefined();
  });

  it('returns trending content', async () => {
    const response = await request(app).get('/api/search/trending?limit=5');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
}
);
