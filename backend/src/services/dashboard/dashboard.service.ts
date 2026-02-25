import { UserStatsModel } from '../../models/user-stats.model';
import { MoodCheckinModel } from '../../models/mood-checkin.model';
import { UserMeditationProgressModel } from '../../models/user-meditation-progress.model';
import { UserYogaProgressModel } from '../../models/user-yoga-progress.model';
import { UserMantraProgressModel } from '../../models/user-mantra-progress.model';
import { MeditationModel } from '../../models/meditation.model';
import { YogaModel } from '../../models/yoga.model';
import { MantraModel } from '../../models/mantra.model';
import { HttpError } from '../../errors/http-error';

export class DashboardService {
  async getUserStats(userId: string) {
    const stats = await UserStatsModel.findOne({ user_id: userId }).lean();
    if (!stats) {
      throw new HttpError(404, 'User stats not found');
    }
    return stats;
  }

  async getDashboardStats(userId: string) {
    const stats = await UserStatsModel.findOne({ user_id: userId }).lean();
    
    if (!stats) {
      return {
        total_sessions_completed: 0,
        total_meditation_minutes: 0,
        total_yoga_minutes: 0,
        total_mantras_practiced: 0,
        current_streak_days: 0,
        longest_streak_days: 0,
      };
    }

    return {
      total_sessions_completed: stats.total_sessions_completed || 0,
      total_meditation_minutes: stats.total_meditation_minutes || 0,
      total_yoga_minutes: stats.total_yoga_minutes || 0,
      total_mantras_practiced: stats.total_mantras_practiced || 0,
      current_streak_days: stats.current_streak_days || 0,
      longest_streak_days: stats.longest_streak_days || 0,
    };
  }

  async getRecentMoodCheckins(userId: string, limit: number = 7) {
    const moods = await MoodCheckinModel.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    return moods.reverse(); // Reverse to get oldest first for chart display
  }

  async getMoodSummary(userId: string, days: number = 30) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const moods = await MoodCheckinModel.aggregate([
      {
        $match: {
          user_id: userId,
          created_at: { $gte: dateThreshold },
        },
      },
      {
        $group: {
          _id: '$mood_code',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return moods;
  }

  async getRecommendedContent(userId: string, limit: number = 8) {
    // Get user's completed meditations to understand preferences
    const meditationProgress = await UserMeditationProgressModel.find({
      user_id: userId,
      status: 'completed',
    })
      .limit(3)
      .lean();

    const yogaProgress = await UserYogaProgressModel.find({
      user_id: userId,
      status: 'completed',
    })
      .limit(3)
      .lean();

    const mantraProgress = await UserMantraProgressModel.find({
      user_id: userId,
      status: 'completed',
    })
      .limit(3)
      .lean();

    // Extract goal_slugs from completed items to recommend similar content
    const goalSlugs = new Set<string>();

    // Get meditation goal slugs
    if (meditationProgress.length > 0) {
      const meditationGoals = await MeditationModel.find({
        id: { $in: meditationProgress.map((p: any) => p.meditation_id) },
      })
        .select('goal_slug')
        .lean();

      meditationGoals.forEach((m: any) => {
        if (m.goal_slug) goalSlugs.add(m.goal_slug);
      });
    }

    // Recommend new meditations with similar goals
    const recommendations = await MeditationModel.find({
      is_active: true,
      goal_slug: { $in: Array.from(goalSlugs) },
      id: { $nin: meditationProgress.map((p: any) => p.meditation_id) },
    })
      .limit(Math.ceil(limit / 3))
      .lean();

    return recommendations;
  }

  async getTrendingContent(limit: number = 4) {
    const trendingMeditations = await MeditationModel.find({
      is_active: true,
      is_trending: true,
    })
      .limit(limit)
      .lean();

    const trendingYogas = await YogaModel.find({
      is_active: true,
      is_trending: true,
    })
      .limit(Math.ceil(limit / 2))
      .lean();

    return {
      meditations: trendingMeditations,
      yogas: trendingYogas,
    };
  }

  async recordMoodCheckin(userId: string, moodCode: string) {
    const moodCheckin = new MoodCheckinModel({
      user_id: userId,
      mood_code: moodCode,
    });

    return moodCheckin.save();
  }

  async updateUserStats(userId: string, stats: Partial<any>) {
    const updated = await UserStatsModel.findOneAndUpdate({ user_id: userId }, stats, {
      new: true,
      upsert: true,
    }).lean();

    return updated;
  }

  async getRecentActivity(userId: string, limit: number = 10) {
    // Get recent completed meditations
    const recentMeditations = await UserMeditationProgressModel.find({
      user_id: userId,
      status: 'completed',
    })
      .sort({ completed_at: -1 })
      .limit(limit)
      .lean();

    // Enrich with meditation details
    const enrichedMeditations = await Promise.all(
      recentMeditations.map(async (progress: any) => {
        const meditation = await MeditationModel.findOne({ id: progress.meditation_id }).lean();
        return {
          type: 'meditation',
          content_id: progress.meditation_id,
          title: meditation?.title || 'Unknown',
          completed_at: progress.completed_at,
          duration_seconds: meditation?.duration_seconds,
        };
      })
    );

    return enrichedMeditations;
  }
}
