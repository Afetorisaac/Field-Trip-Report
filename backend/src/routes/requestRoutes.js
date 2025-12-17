import express from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  approveRequest,
  rejectRequest
} from '../controllers/requestController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a new procurement request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Request created successfully
 */
router.post(
  '/',
  authenticate,
  validate(schemas.createRequest),
  auditLog('create_request', 'request'),
  createRequest
);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Get all requests (filtered by role)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 */
router.get('/', authenticate, getRequests);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Get request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request details
 */
router.get('/:id', authenticate, getRequestById);

/**
 * @swagger
 * /api/requests/{id}/approve:
 *   post:
 *     summary: Approve a request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request approved successfully
 */
router.post(
  '/:id/approve',
  authenticate,
  authorize('dept_head', 'admin'),
  auditLog('approve_request', 'request'),
  approveRequest
);

/**
 * @swagger
 * /api/requests/{id}/reject:
 *   post:
 *     summary: Reject a request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request rejected successfully
 */
router.post(
  '/:id/reject',
  authenticate,
  authorize('dept_head', 'admin'),
  validate(schemas.approveReject),
  auditLog('reject_request', 'request'),
  rejectRequest
);

export default router;
