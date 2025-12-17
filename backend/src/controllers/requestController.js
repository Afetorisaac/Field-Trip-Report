import Request from '../models/Request.js';

export const createRequest = async (req, res, next) => {
  try {
    const { title, description, items, priority, notes } = req.body;
    
    // Calculate total estimated cost
    const totalEstimatedCost = items.reduce((sum, item) => {
      return sum + (item.quantity * item.estimatedPrice);
    }, 0);
    
    const request = await Request.create({
      title,
      description,
      items,
      totalEstimatedCost,
      requester: req.user._id,
      department: req.user.department,
      priority: priority || 'medium',
      notes
    });
    
    await request.populate('requester', '-password');
    
    res.status(201).json({
      message: 'Request created successfully',
      request
    });
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const { status, department, priority, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Role-based filtering
    if (req.user.role === 'requester') {
      query.requester = req.user._id;
    } else if (req.user.role === 'dept_head') {
      query.department = req.user.department;
    }
    // procurement and admin can see all requests
    
    if (status) query.status = status;
    if (department && ['admin', 'procurement'].includes(req.user.role)) {
      query.department = department;
    }
    if (priority) query.priority = priority;
    
    const skip = (page - 1) * limit;
    
    const [requests, total] = await Promise.all([
      Request.find(query)
        .populate('requester', '-password')
        .populate('approvedBy', '-password')
        .populate('rejectedBy', '-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Request.countDocuments(query)
    ]);
    
    res.json({
      requests,
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

export const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', '-password')
      .populate('approvedBy', '-password')
      .populate('rejectedBy', '-password')
      .populate('purchaseOrder');
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Check access permissions
    if (req.user.role === 'requester' && request.requester._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'dept_head' && request.department !== req.user.department) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ request });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request cannot be approved in current status' });
    }
    
    // Department heads can only approve requests from their department
    if (req.user.role === 'dept_head' && request.department !== req.user.department) {
      return res.status(403).json({ error: 'Can only approve requests from your department' });
    }
    
    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();
    
    await request.save();
    await request.populate('requester approvedBy', '-password');
    
    res.json({
      message: 'Request approved successfully',
      request
    });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request cannot be rejected in current status' });
    }
    
    // Department heads can only reject requests from their department
    if (req.user.role === 'dept_head' && request.department !== req.user.department) {
      return res.status(403).json({ error: 'Can only reject requests from your department' });
    }
    
    request.status = 'rejected';
    request.rejectedBy = req.user._id;
    request.rejectedAt = new Date();
    request.rejectionReason = rejectionReason;
    
    await request.save();
    await request.populate('requester rejectedBy', '-password');
    
    res.json({
      message: 'Request rejected successfully',
      request
    });
  } catch (error) {
    next(error);
  }
};
