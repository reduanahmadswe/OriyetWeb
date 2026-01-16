import prisma from '../../config/db.js';
import { AppError } from '../../middlewares/error.middleware.js';

class ReviewService {
  // Create a new review
  async createReview(userId: number, eventId: number, rating: number, comment?: string) {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if event has ended
    if (new Date() < event.endDate) {
      throw new AppError('You can only review events that have ended', 400);
    }

    // Check if user was registered for the event
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        userId,
        eventId,
        status: 'confirmed',
      },
    });

    if (!registration) {
      throw new AppError('You must be a confirmed participant to review this event', 403);
    }

    // Check if user has already reviewed this event
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this event', 400);
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        eventId,
        rating,
        comment: comment || null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        event: {
          select: { id: true, title: true },
        },
      },
    });

    return {
      message: 'Review submitted successfully',
      review,
    };
  }

  // Get user's reviews
  async getMyReviews(userId: number) {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        event: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { reviews };
  }

  // Get approved reviews (public)
  async getApprovedReviews(featured?: boolean, limit?: number) {
    const where: any = { isApproved: true };

    if (featured) {
      where.isFeatured = true;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        event: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return { reviews };
  }

  // Get all reviews (admin)
  async getAllReviews(filters: {
    isApproved?: boolean;
    eventId?: number;
    page: number;
    limit: number;
  }) {
    const { isApproved, eventId, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isApproved !== undefined) {
      where.isApproved = isApproved;
    }

    if (eventId) {
      where.eventId = eventId;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          event: {
            select: { id: true, title: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update review
  async updateReview(
    reviewId: number,
    userId: number,
    data: { rating?: number; comment?: string }
  ) {
    // Check if review exists and belongs to user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('You can only update your own reviews', 403);
    }

    // If review is already approved, don't allow updates
    if (review.isApproved) {
      throw new AppError('You cannot update an approved review', 400);
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        event: {
          select: { id: true, title: true },
        },
      },
    });

    return {
      message: 'Review updated successfully',
      review: updatedReview,
    };
  }

  // Delete review
  async deleteReview(reviewId: number, userId: number) {
    // Check if review exists and belongs to user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('You can only delete your own reviews', 403);
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }

  // Approve or reject review (admin)
  async approveReview(
    reviewId: number,
    adminId: number,
    isApproved: boolean,
    isFeatured?: boolean
  ) {
    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    const updateData: any = {
      isApproved,
      approvedAt: isApproved ? new Date() : null,
      approvedBy: isApproved ? adminId : null,
    };

    if (isFeatured !== undefined && isApproved) {
      updateData.isFeatured = isFeatured;
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        event: {
          select: { id: true, title: true },
        },
      },
    });

    return {
      message: isApproved ? 'Review approved successfully' : 'Review rejected successfully',
      review: updatedReview,
    };
  }

  // Get review statistics
  async getReviewStats() {
    const [total, pending, approved, featured] = await Promise.all([
      prisma.review.count(),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.review.count({ where: { isApproved: true } }),
      prisma.review.count({ where: { isApproved: true, isFeatured: true } }),
    ]);

    const avgRating = await prisma.review.aggregate({
      where: { isApproved: true },
      _avg: { rating: true },
    });

    return {
      stats: {
        total,
        pending,
        approved,
        featured,
        averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0,
      },
    };
  }
}

export const reviewService = new ReviewService();
