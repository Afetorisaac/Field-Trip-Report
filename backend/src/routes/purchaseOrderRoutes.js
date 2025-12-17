import express from 'express';
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  markDelivered
} from '../controllers/purchaseOrderController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

/**
 * @swagger
 * /api/requests/{id}/create-po:
 *   post:
 *     summary: Create purchase order for a request
 *     tags: [Purchase Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Purchase order created successfully
 */
router.post(
  '/requests/:id/create-po',
  authenticate,
  authorize('procurement', 'admin'),
  validate(schemas.createPO),
  auditLog('create_purchase_order', 'purchase_order'),
  createPurchaseOrder
);

/**
 * @swagger
 * /api/po:
 *   get:
 *     summary: Get all purchase orders
 *     tags: [Purchase Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchase orders
 */
router.get(
  '/po',
  authenticate,
  authorize('procurement', 'admin'),
  getPurchaseOrders
);

/**
 * @swagger
 * /api/po/{id}:
 *   get:
 *     summary: Get purchase order by ID
 *     tags: [Purchase Orders]
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
 *         description: Purchase order details
 */
router.get(
  '/po/:id',
  authenticate,
  authorize('procurement', 'admin'),
  getPurchaseOrderById
);

/**
 * @swagger
 * /api/po/{id}/mark-delivered:
 *   post:
 *     summary: Mark purchase order as delivered
 *     tags: [Purchase Orders]
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
 *         description: Purchase order marked as delivered
 */
router.post(
  '/po/:id/mark-delivered',
  authenticate,
  authorize('procurement', 'admin'),
  auditLog('mark_delivered', 'purchase_order'),
  markDelivered
);

export default router;
