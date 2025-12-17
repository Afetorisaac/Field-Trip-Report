import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true,
    unique: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  supplier: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String
    },
    email: {
      type: String
    },
    address: {
      type: String
    }
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
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      default: 'pcs'
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['created', 'sent', 'confirmed', 'delivered', 'cancelled'],
    default: 'created'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryDate: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  deliveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate PO number before saving
purchaseOrderSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const count = await mongoose.model('PurchaseOrder').countDocuments();
  const year = new Date().getFullYear();
  this.poNumber = `PO-${year}-${String(count + 1).padStart(5, '0')}`;
  next();
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
