const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

// User Model
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    imageUrl: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false }
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

const UserModel = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    // Connect to MongoDB
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/tridivya_wellness';
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@tridivya.com',
      username: 'admin',
      password: 'admin123456', // Change this to a secure password
      role: 'admin',
    };

    // Check if admin user already exists
    const existingAdmin = await UserModel.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', adminData.email);
      console.log('   Email: admin@tridivya.com');
      console.log('   Password: admin123456');
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(adminData.password, 10);

    // Create admin user
    const newAdmin = new UserModel({
      ...adminData,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();
    console.log('✅ Admin user created successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log('   Email: admin@tridivya.com');
    console.log('   Password: admin123456');
    console.log('   Username: admin');
    console.log('\n⚠️  Please change the password after first login for security!');

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Database disconnected');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
}

seedAdmin();
