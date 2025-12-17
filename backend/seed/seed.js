import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Request from '../src/models/Request.js';
import PurchaseOrder from '../src/models/PurchaseOrder.js';
import AuditLog from '../src/models/AuditLog.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Request.deleteMany({});
    await PurchaseOrder.deleteMany({});
    await AuditLog.deleteMany({});

    // Create users
    console.log('Creating users...');
    const users = await User.create([
      {
        email: 'admin@ella.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        department: 'Administration'
      },
      {
        email: 'ella@ella.com',
        password: 'ella123',
        name: 'Emmanuella Nana Ama Weir',
        role: 'requester',
        department: 'Operations'
      },
      {
        email: 'depthead@ella.com',
        password: 'dept123',
        name: 'Department Head',
        role: 'dept_head',
        department: 'Operations'
      },
      {
        email: 'procurement@ella.com',
        password: 'proc123',
        name: 'Procurement Officer',
        role: 'procurement',
        department: 'Procurement'
      },
      {
        email: 'john.doe@ella.com',
        password: 'john123',
        name: 'John Doe',
        role: 'requester',
        department: 'IT'
      },
      {
        email: 'it.head@ella.com',
        password: 'head123',
        name: 'IT Department Head',
        role: 'dept_head',
        department: 'IT'
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Create sample requests
    console.log('Creating sample requests...');
    const requests = await Request.create([
      {
        title: 'Office Supplies for Q1',
        description: 'Need office supplies including pens, papers, and folders for the first quarter',
        items: [
          { name: 'Blue Pens', quantity: 100, estimatedPrice: 0.5, unit: 'pcs' },
          { name: 'A4 Paper Reams', quantity: 20, estimatedPrice: 5, unit: 'reams' },
          { name: 'File Folders', quantity: 50, estimatedPrice: 1, unit: 'pcs' }
        ],
        totalEstimatedCost: 200,
        requester: users[1]._id, // Ella
        department: 'Operations',
        status: 'pending',
        priority: 'medium'
      },
      {
        title: 'Laptop Computers',
        description: 'Need 5 new laptop computers for new employees',
        items: [
          { name: 'Dell Latitude 5520', quantity: 5, estimatedPrice: 1200, unit: 'pcs' }
        ],
        totalEstimatedCost: 6000,
        requester: users[4]._id, // John
        department: 'IT',
        status: 'pending',
        priority: 'high'
      },
      {
        title: 'Cleaning Supplies',
        description: 'Monthly cleaning supplies for office maintenance',
        items: [
          { name: 'Disinfectant Spray', quantity: 10, estimatedPrice: 8, unit: 'bottles' },
          { name: 'Paper Towels', quantity: 30, estimatedPrice: 3, unit: 'rolls' },
          { name: 'Trash Bags', quantity: 5, estimatedPrice: 12, unit: 'boxes' }
        ],
        totalEstimatedCost: 230,
        requester: users[1]._id, // Ella
        department: 'Operations',
        status: 'approved',
        priority: 'low',
        approvedBy: users[2]._id,
        approvedAt: new Date()
      }
    ]);

    console.log(`Created ${requests.length} sample requests`);

    // Create a sample purchase order for the approved request
    console.log('Creating sample purchase order...');
    const po = await PurchaseOrder.create({
      request: requests[2]._id,
      supplier: {
        name: 'CleanPro Supplies Inc.',
        contact: '+1-555-0123',
        email: 'sales@cleanpro.com',
        address: '123 Supplier Street, Business City, BC 12345'
      },
      items: [
        { name: 'Disinfectant Spray', quantity: 10, unitPrice: 7.5, totalPrice: 75, unit: 'bottles' },
        { name: 'Paper Towels', quantity: 30, unitPrice: 2.8, totalPrice: 84, unit: 'rolls' },
        { name: 'Trash Bags', quantity: 5, unitPrice: 11, totalPrice: 55, unit: 'boxes' }
      ],
      totalAmount: 214,
      tax: 21.4,
      grandTotal: 235.4,
      createdBy: users[3]._id, // Procurement officer
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'created'
    });

    // Update the request with PO reference
    requests[2].purchaseOrder = po._id;
    requests[2].status = 'po_created';
    await requests[2].save();

    console.log('Created 1 sample purchase order');

    console.log('\n=== Seed Data Summary ===');
    console.log('\nUsers created:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - Password: See seed script`);
    });

    console.log('\nSample requests created:');
    requests.forEach(req => {
      console.log(`  - ${req.requestNumber}: ${req.title} (${req.status})`);
    });

    console.log('\nSample purchase order created:');
    console.log(`  - ${po.poNumber}: For request ${requests[2].requestNumber}`);

    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@ella.com / admin123');
    console.log('Ella (Requester): ella@ella.com / ella123');
    console.log('Dept Head: depthead@ella.com / dept123');
    console.log('Procurement: procurement@ella.com / proc123');
    console.log('John (Requester): john.doe@ella.com / john123');
    console.log('IT Head: it.head@ella.com / head123');

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
