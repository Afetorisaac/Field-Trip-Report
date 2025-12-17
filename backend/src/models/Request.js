import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    estimatedPrice: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      default: 'pcs'
    }
  }],
  totalEstimatedCost: {
    type: Number,
    required: true,
    min: 0
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'po_created', 'delivered', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  purchaseOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate request number before saving
requestSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const count = await mongoose.model('Request').countDocuments();
  const year = new Date().getFullYear();
  this.requestNumber = `REQ-${year}-${String(count + 1).padStart(5, '0')}`;
  next();
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
