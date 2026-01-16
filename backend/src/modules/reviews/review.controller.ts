import { Request, Response } from 'express';
import { AuthRequest } from '../../types/express.js';
import { asyncHandler } from '../../middlewares/error.middleware.js';
import { reviewService } from './review.service.js';

class ReviewController {
  createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { eventId, rating, comment } = req.body;
    const userId = req.user!.id;

    const result = await reviewService.createReview(userId, eventId, rating, comment);

    res.status(201).json({
      success: true,
      ...result,
    });
  });

  getMyReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const result = await reviewService.getMyReviews(userId);

    res.json({
      success: true,
      ...result,
    });
  });

  getApprovedReviews = asyncHandler(async (req: Request, res: Response) => {
    const featured = req.query.featured === 'true';
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    const result = await reviewService.getApprovedReviews(featured, limit);

    res.json({
      success: true,
      ...result,
    });
  });

  getAllReviews = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      isApproved: req.query.isApproved ? req.query.isApproved === 'true' : undefined,
      eventId: req.query.eventId ? parseInt(req.query.eventId as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await reviewService.getAllReviews(filters);

    res.json({
      success: true,
      ...result,
    });
  });

  updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reviewId = parseInt(req.params.id);
    const userId = req.user!.id;
    const { rating, comment } = req.body;

    const result = await reviewService.updateReview(reviewId, userId, { rating, comment });

    res.json({
      success: true,
      ...result,
    });
  });

  deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reviewId = parseInt(req.params.id);
    const userId = req.user!.id;

    const result = await reviewService.deleteReview(reviewId, userId);

    res.json({
      success: true,
      ...result,
    });
  });

  approveReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reviewId = parseInt(req.params.id);
    const adminId = req.user!.id;
    const { isApproved, isFeatured } = req.body;

    const result = await reviewService.approveReview(reviewId, adminId, isApproved, isFeatured);

    res.json({
      success: true,
      ...result,
    });
  });

  getReviewStats = asyncHandler(async (req: Request, res: Response) => {
    const result = await reviewService.getReviewStats();

    res.json({
      success: true,
      ...result,
    });
  });
}

export const reviewController = new ReviewController();
