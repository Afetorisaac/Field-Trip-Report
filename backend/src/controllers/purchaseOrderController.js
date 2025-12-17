import PurchaseOrder from '../models/PurchaseOrder.js';
import Request from '../models/Request.js';

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const { supplier, items, tax, deliveryDate, notes } = req.body;
    const requestId = req.params.id;
    
    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.status !== 'approved') {
      return res.status(400).json({ error: 'Can only create PO for approved requests' });
    }
    
    if (request.purchaseOrder) {
      return res.status(400).json({ error: 'Purchase order already exists for this request' });
    }
    
    // Calculate totals
    const itemsWithTotals = items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));
    
    const totalAmount = itemsWithTotals.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = tax || 0;
    const grandTotal = totalAmount + taxAmount;
    
    const purchaseOrder = await PurchaseOrder.create({
      request: requestId,
      supplier,
      items: itemsWithTotals,
      totalAmount,
      tax: taxAmount,
      grandTotal,
      createdBy: req.user._id,
      deliveryDate,
      notes
    });
    
    // Update request
    request.status = 'po_created';
    request.purchaseOrder = purchaseOrder._id;
    await request.save();
    
    await purchaseOrder.populate('request createdBy', '-password');
    
    res.status(201).json({
      message: 'Purchase order created successfully',
      purchaseOrder
    });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    
    const [purchaseOrders, total] = await Promise.all([
      PurchaseOrder.find(query)
        .populate({
          path: 'request',
          populate: { path: 'requester', select: '-password' }
        })
        .populate('createdBy', '-password')
        .populate('deliveredBy', '-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      PurchaseOrder.countDocuments(query)
    ]);
    
    res.json({
      purchaseOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseOrderById = async (req, res, next) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)
      .populate({
        path: 'request',
        populate: { path: 'requester', select: '-password' }
      })
      .populate('createdBy', '-password')
      .populate('deliveredBy', '-password');
    
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    
    res.json({ purchaseOrder });
  } catch (error) {
    next(error);
  }
};

export const markDelivered = async (req, res, next) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    
    if (purchaseOrder.status === 'delivered') {
      return res.status(400).json({ error: 'Purchase order already marked as delivered' });
    }
    
    purchaseOrder.status = 'delivered';
    purchaseOrder.deliveredAt = new Date();
    purchaseOrder.deliveredBy = req.user._id;
    
    await purchaseOrder.save();
    
    // Update request status
    await Request.findByIdAndUpdate(purchaseOrder.request, {
      status: 'delivered'
    });
    
    await purchaseOrder.populate('request createdBy deliveredBy', '-password');
    
    res.json({
      message: 'Purchase order marked as delivered',
      purchaseOrder
    });
  } catch (error) {
    next(error);
  }
};
