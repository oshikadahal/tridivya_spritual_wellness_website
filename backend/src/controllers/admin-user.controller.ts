import { UserService } from '../services/user.service';
import { CreateUserDTO, UpdateUserDto } from '../dtos/user.dto';
import { Request, Response } from 'express';
import z from 'zod';
import { UserModel } from '../models/user.model';
import { Booking } from '../models/booking.model';
import { YogaModel } from '../models/yoga.model';
import { MeditationModel } from '../models/meditation.model';
import { MantraModel } from '../models/mantra.model';
import { LibraryItemModel } from '../models/library-item.model';
import { UserYogaReviewModel } from '../models/user-yoga-review.model';
import { UserMeditationReviewModel } from '../models/user-meditation-review.model';
import { UserMantraReviewModel } from '../models/user-mantra-review.model';
import { UserLibraryReviewModel } from '../models/user-library-review.model';
import { UserYogaProgressModel } from '../models/user-yoga-progress.model';
import { UserMeditationProgressModel } from '../models/user-meditation-progress.model';
import { UserMantraProgressModel } from '../models/user-mantra-progress.model';

const userService = new UserService();

function prettifyZodError(error: z.ZodError) {
  return error.issues.map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`).join('; ');
}

export class AdminUserController {
  private getReviewModelConfig(type: string) {
    if (type === 'yoga') {
      return { model: UserYogaReviewModel, field: 'yoga_id' } as const;
    }
    if (type === 'meditation') {
      return { model: UserMeditationReviewModel, field: 'meditation_id' } as const;
    }
    if (type === 'mantra') {
      return { model: UserMantraReviewModel, field: 'mantra_id' } as const;
    }
    if (type === 'library') {
      return { model: UserLibraryReviewModel, field: 'library_item_id' } as const;
    }
    return null;
  }

  // GET /api/admin/reviews - Get all reviews (all content types)
  async getAllReviews(req: Request, res: Response) {
    try {
      const [yogaReviews, meditationReviews, mantraReviews, libraryReviews] = await Promise.all([
        UserYogaReviewModel.find({}).sort({ created_at: -1 }).lean(),
        UserMeditationReviewModel.find({}).sort({ created_at: -1 }).lean(),
        UserMantraReviewModel.find({}).sort({ created_at: -1 }).lean(),
        UserLibraryReviewModel.find({}).sort({ created_at: -1 }).lean(),
      ]);

      const yogaIds = [...new Set(yogaReviews.map((r: any) => r.yoga_id).filter(Boolean))];
      const meditationIds = [...new Set(meditationReviews.map((r: any) => r.meditation_id).filter(Boolean))];
      const mantraIds = [...new Set(mantraReviews.map((r: any) => r.mantra_id).filter(Boolean))];
      const libraryIds = [...new Set(libraryReviews.map((r: any) => r.library_item_id).filter(Boolean))];

      const [yogaItems, meditationItems, mantraItems, libraryItems] = await Promise.all([
        YogaModel.find({ id: { $in: yogaIds } }).select('id title').lean(),
        MeditationModel.find({ id: { $in: meditationIds } }).select('id title').lean(),
        MantraModel.find({ id: { $in: mantraIds } }).select('id title').lean(),
        LibraryItemModel.find({ id: { $in: libraryIds } }).select('id title').lean(),
      ]);

      const yogaMap = new Map((yogaItems as any[]).map((item) => [item.id, item.title]));
      const meditationMap = new Map((meditationItems as any[]).map((item) => [item.id, item.title]));
      const mantraMap = new Map((mantraItems as any[]).map((item) => [item.id, item.title]));
      const libraryMap = new Map((libraryItems as any[]).map((item) => [item.id, item.title]));

      const allReviews = [
        ...yogaReviews.map((r: any) => ({
          id: r.id,
          type: 'yoga',
          content_id: r.yoga_id,
          content_title: yogaMap.get(r.yoga_id) || 'Unknown Yoga',
          rating: r.rating,
          comment: r.comment || '',
          user_id: r.user_id,
          created_at: r.created_at,
        })),
        ...meditationReviews.map((r: any) => ({
          id: r.id,
          type: 'meditation',
          content_id: r.meditation_id,
          content_title: meditationMap.get(r.meditation_id) || 'Unknown Meditation',
          rating: r.rating,
          comment: r.comment || '',
          user_id: r.user_id,
          created_at: r.created_at,
        })),
        ...mantraReviews.map((r: any) => ({
          id: r.id,
          type: 'mantra',
          content_id: r.mantra_id,
          content_title: mantraMap.get(r.mantra_id) || 'Unknown Mantra',
          rating: r.rating,
          comment: r.comment || '',
          user_id: r.user_id,
          created_at: r.created_at,
        })),
        ...libraryReviews.map((r: any) => ({
          id: r.id,
          type: 'library',
          content_id: r.library_item_id,
          content_title: libraryMap.get(r.library_item_id) || 'Unknown Library Item',
          rating: r.rating,
          comment: r.comment || '',
          user_id: r.user_id,
          created_at: r.created_at,
        })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return res.status(200).json({
        success: true,
        message: 'Reviews fetched successfully',
        data: allReviews,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // POST /api/admin/reviews/:type/:contentId - Create review (admin)
  async createReview(req: Request, res: Response) {
    try {
      const { type, contentId } = req.params;
      const config = this.getReviewModelConfig(type);
      if (!config) {
        return res.status(400).json({ success: false, message: 'Invalid review type' });
      }

      const rating = Number(req.body?.rating);
      const comment = typeof req.body?.comment === 'string' ? req.body.comment : '';

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }

      const userId = (req.user as any)?.id || (req.user as any)?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const payload: any = {
        user_id: userId,
        rating,
        comment,
        created_at: new Date(),
        updated_at: new Date(),
      };
      payload[config.field] = contentId;

      const reviewModel: any = config.model;
      const created = await reviewModel.create(payload);

      return res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: created,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // PATCH /api/admin/reviews/:type/:contentId/:reviewId - Update review (admin)
  async updateReview(req: Request, res: Response) {
    try {
      const { type, contentId, reviewId } = req.params;
      const config = this.getReviewModelConfig(type);
      if (!config) {
        return res.status(400).json({ success: false, message: 'Invalid review type' });
      }

      const updateData: any = { updated_at: new Date() };
      if (req.body?.rating !== undefined) {
        const rating = Number(req.body.rating);
        if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        updateData.rating = rating;
      }
      if (req.body?.comment !== undefined) {
        updateData.comment = String(req.body.comment ?? '');
      }

      const query: any = { id: reviewId };
      query[config.field] = contentId;

      const reviewModel: any = config.model;
      const updated = await reviewModel.findOneAndUpdate(query, updateData, { new: true }).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: updated,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // DELETE /api/admin/reviews/:type/:contentId/:reviewId - Delete review (admin)
  async deleteReview(req: Request, res: Response) {
    try {
      const { type, contentId, reviewId } = req.params;
      const config = this.getReviewModelConfig(type);
      if (!config) {
        return res.status(400).json({ success: false, message: 'Invalid review type' });
      }

      const query: any = { id: reviewId };
      query[config.field] = contentId;

      const reviewModel: any = config.model;
      const deleted = await reviewModel.findOneAndDelete(query).lean();
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  private buildUploadedFileUrl(req: Request, filename: string): string {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
  }

  // POST /api/admin/uploads/image - Upload image for content items
  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image file is required' });
      }

      const url = this.buildUploadedFileUrl(req, req.file.filename);

      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url,
          filename: req.file.filename,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // POST /api/admin/uploads/video - Upload admin content video
  async uploadVideo(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Video file is required' });
      }

      const url = this.buildUploadedFileUrl(req, req.file.filename);

      return res.status(201).json({
        success: true,
        message: 'Video uploaded successfully',
        data: {
          url,
          filename: req.file.filename,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // GET /api/admin/dashboard/overview - Get admin overview dashboard stats
  async getAdminOverviewStats(req: Request, res: Response) {
    try {
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);

      const startOfLast30Days = new Date(now);
      startOfLast30Days.setDate(startOfLast30Days.getDate() - 30);

      const startOfPrevious30Days = new Date(now);
      startOfPrevious30Days.setDate(startOfPrevious30Days.getDate() - 60);

      const [
        totalUsers,
        todayUsers,
        currentMonthUsers,
        previousMonthUsers,
        todaysBookings,
        yesterdayBookings,
        upcomingBookings,
        yogaCount,
        meditationCount,
        mantraCount,
        libraryCount,
        yogaReviewsToday,
        meditationReviewsToday,
        mantraReviewsToday,
        libraryReviewsToday,
        yogaReviewsYesterday,
        meditationReviewsYesterday,
        mantraReviewsYesterday,
        libraryReviewsYesterday,
        yogaProgressTotal,
        yogaProgressCompleted,
        meditationProgressTotal,
        meditationProgressCompleted,
        mantraProgressCurrentWindow,
        mantraProgressPreviousWindow,
      ] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ createdAt: { $gte: startOfToday, $lt: startOfTomorrow } }),
        UserModel.countDocuments({ createdAt: { $gte: startOfLast30Days } }),
        UserModel.countDocuments({ createdAt: { $gte: startOfPrevious30Days, $lt: startOfLast30Days } }),
        Booking.countDocuments({ booking_date: { $gte: startOfToday, $lt: startOfTomorrow } }),
        Booking.countDocuments({ booking_date: { $gte: startOfYesterday, $lt: startOfToday } }),
        Booking.countDocuments({ status: 'upcoming', booking_date: { $gte: now } }),
        YogaModel.countDocuments({ is_active: true }),
        MeditationModel.countDocuments({ is_active: true }),
        MantraModel.countDocuments({ is_active: true }),
        LibraryItemModel.countDocuments({ is_active: true }),
        UserYogaReviewModel.countDocuments({ created_at: { $gte: startOfToday, $lt: startOfTomorrow } }),
        UserMeditationReviewModel.countDocuments({ created_at: { $gte: startOfToday, $lt: startOfTomorrow } }),
        UserMantraReviewModel.countDocuments({ created_at: { $gte: startOfToday, $lt: startOfTomorrow } }),
        UserLibraryReviewModel.countDocuments({ created_at: { $gte: startOfToday, $lt: startOfTomorrow } }),
        UserYogaReviewModel.countDocuments({ created_at: { $gte: startOfYesterday, $lt: startOfToday } }),
        UserMeditationReviewModel.countDocuments({ created_at: { $gte: startOfYesterday, $lt: startOfToday } }),
        UserMantraReviewModel.countDocuments({ created_at: { $gte: startOfYesterday, $lt: startOfToday } }),
        UserLibraryReviewModel.countDocuments({ created_at: { $gte: startOfYesterday, $lt: startOfToday } }),
        UserYogaProgressModel.countDocuments(),
        UserYogaProgressModel.countDocuments({ status: 'completed' }),
        UserMeditationProgressModel.countDocuments(),
        UserMeditationProgressModel.countDocuments({ status: 'completed' }),
        UserMantraProgressModel.countDocuments({ updated_at: { $gte: startOfLast30Days } }),
        UserMantraProgressModel.countDocuments({ updated_at: { $gte: startOfPrevious30Days, $lt: startOfLast30Days } }),
      ]);

      const totalReviewsToday = yogaReviewsToday + meditationReviewsToday + mantraReviewsToday + libraryReviewsToday;
      const totalReviewsYesterday = yogaReviewsYesterday + meditationReviewsYesterday + mantraReviewsYesterday + libraryReviewsYesterday;

      const toPercent = (value: number, total: number) => (total > 0 ? Math.round((value / total) * 100) : 0);
      const toGrowthPercent = (current: number, previous: number) => {
        if (previous <= 0) {
          return current > 0 ? 100 : 0;
        }
        return Math.round(((current - previous) / previous) * 100);
      };

      const totalAssets = yogaCount + meditationCount + mantraCount;
      const yogaShare = toPercent(yogaCount, totalAssets);
      const meditationShare = toPercent(meditationCount, totalAssets);
      const mantraShare = Math.max(0, 100 - yogaShare - meditationShare);

      const yogaCompletion = toPercent(yogaProgressCompleted, yogaProgressTotal);
      const meditationEngagement = toPercent(meditationProgressCompleted, meditationProgressTotal);
      const mantraGrowth = Math.max(0, toGrowthPercent(mantraProgressCurrentWindow, mantraProgressPreviousWindow));
      const monthlyActiveUsersGrowth = toGrowthPercent(currentMonthUsers, previousMonthUsers);
      const bookingsDelta = toGrowthPercent(todaysBookings, yesterdayBookings);
      const reviewsDelta = toGrowthPercent(totalReviewsToday, totalReviewsYesterday);

      const overview = {
        cards: {
          totalUsers,
          usersDelta: monthlyActiveUsersGrowth,
          todaysBookings,
          bookingsDelta,
          newReviews: totalReviewsToday,
          reviewsDelta,
          contentLibrary: yogaCount + meditationCount + mantraCount + libraryCount,
        },
        distribution: {
          yoga: yogaShare,
          meditation: meditationShare,
          mantras: mantraShare,
          totalAssets,
        },
        highlights: {
          yogaCompletion,
          meditationEngagement,
          mantraGrowth,
          monthlyActiveUsersGrowth,
        },
        recentActivity: [
          {
            type: 'users',
            title: `${todayUsers} new users joined`,
            subtitle: 'Joined today',
          },
          {
            type: 'reviews',
            title: `${totalReviewsToday} new reviews`,
            subtitle: 'Submitted today',
          },
          {
            type: 'bookings',
            title: `${upcomingBookings} classes starting soon`,
            subtitle: 'Upcoming booking schedule',
          },
        ],
      };

      return res.status(200).json({
        success: true,
        message: 'Admin overview stats fetched successfully',
        data: overview,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // POST /api/admin/users - Create new user
  async createUser(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsedData.error) });
      }
      
      const userData: any = parsedData.data;
      
      // Add image if uploaded
      if (req.file) {
        userData.imageUrl = this.buildUploadedFileUrl(req, req.file.filename);
      }
      
      const newUser = await userService.createUser(userData);
      return res.status(201).json({ success: true, message: 'User Created', data: newUser });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // GET /api/admin/users - Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const result = await userService.getAllUsers(page, limit);
      return res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // GET /api/admin/users/:id - Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      return res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // PUT /api/admin/users/:id - Update user
  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const parsedData = UpdateUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsedData.error) });
      }
      
      // Add image if uploaded
      if (req.file) {
        parsedData.data.imageUrl = this.buildUploadedFileUrl(req, req.file.filename);
      }
      
      const updatedUser = await userService.updateUser(userId, parsedData.data);
      return res.status(200).json({ success: true, data: updatedUser, message: "User updated successfully" });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  // DELETE /api/admin/users/:id - Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const deleted = await userService.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  // GET /api/admin/profile - Get current admin profile
  async getAdminProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId; // Set by authorization middleware
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const user = await userService.getUserById(userId);
      return res.status(200).json({ success: true, message: 'Profile fetched successfully', data: user });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // PUT /api/admin/profile - Update admin profile
  async updateAdminProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId; // Set by authorization middleware
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const parsedData = UpdateUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsedData.error) });
      }

      // Add image if uploaded
      if (req.file) {
        parsedData.data.imageUrl = this.buildUploadedFileUrl(req, req.file.filename);
      }

      const updatedUser = await userService.updateUser(userId, parsedData.data);
      return res.status(200).json({ success: true, data: updatedUser, message: 'Profile updated successfully' });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // DELETE /api/admin/profile/picture - Delete admin profile picture
  async deleteAdminProfilePicture(req: Request, res: Response) {
    try {
      const userId = (req as any).userId; // Set by authorization middleware
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const updatedUser = await userService.updateUser(userId, { imageUrl: "" });
      return res.status(200).json({ success: true, data: updatedUser, message: 'Profile picture deleted successfully' });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }
}
