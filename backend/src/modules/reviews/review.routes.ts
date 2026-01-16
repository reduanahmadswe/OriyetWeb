import { Router } from 'express';
import { reviewController } from './review.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  createReviewValidation,
  updateReviewValidation,
  approveReviewValidation,
} from './review.validation.js';

const router = Router();

// Public routes
router.get('/approved', reviewController.getApprovedReviews);

// Protected routes (user)
router.post('/', authenticate, validate(createReviewValidation), reviewController.createReview);
router.get('/my-reviews', authenticate, reviewController.getMyReviews);
router.put('/:id', authenticate, validate(updateReviewValidation), reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

// Admin routes
router.get('/all', authenticate, requireRole('admin'), reviewController.getAllReviews);
router.get('/stats', authenticate, requireRole('admin'), reviewController.getReviewStats);
router.patch('/:id/approve', authenticate, requireRole('admin'), validate(approveReviewValidation), reviewController.approveReview);

export default router;
