const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';

  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log('Admin user already exists. Skipping seed.');
    process.exit(0);
  }

  await User.create({ name: 'Admin', email, password, role: 'admin' });
  console.log(`Admin user created: ${email}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
