const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Simple User Schema for testing
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  firstName: String,
  lastName: String,
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);

async function checkAndSeedAccounts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing users
    const existingUsers = await User.find({}, { email: 1, username: 1, role: 1, _id: 0 });
    console.log('\n📋 Existing Users in Database:');
    if (existingUsers.length === 0) {
      console.log('   No users found');
    } else {
      existingUsers.forEach(u => console.log(`   - ${u.email} (${u.username}) [${u.role}]`));
    }

    // Define accounts to seed
    const accountsToSeed = [
      { email: 'admin@tridivya.com', password: 'admin123', username: 'admin_user', firstName: 'Admin', lastName: 'User', role: 'admin' },
      { email: 'test@tridivya.com', password: 'test123', username: 'test_user', firstName: 'Test', lastName: 'User', role: 'user' },
      { email: 'olduser@tridivya.com', password: 'oldpass123', username: 'olduser', firstName: 'Old', lastName: 'User', role: 'user' },
    ];

    console.log('\n🌱 Seeding Accounts...');
    for (const accountData of accountsToSeed) {
      const existingUser = await User.findOne({ email: accountData.email });
      
      if (existingUser) {
        console.log(`   ⚠️  ${accountData.email} already exists, skipping`);
      } else {
        const hashedPassword = await bcrypt.hash(accountData.password, 10);
        const newUser = await User.create({
          ...accountData,
          password: hashedPassword,
        });
        console.log(`   ✅ Created: ${accountData.email} (password: ${accountData.password})`);
      }
    }

    console.log('\n✅ Seed Complete!');
    console.log('\n📝 Test Accounts Created:');
    console.log('   Admin: admin@tridivya.com / admin123');
    console.log('   User1: test@tridivya.com / test123');
    console.log('   User2: olduser@tridivya.com / oldpass123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndSeedAccounts();
