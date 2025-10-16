// Test script to create sample users and test announcement notifications
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const NotificationService = require('./services/notificationService');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forum_academy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createTestUsers() {
  try {
    await connectDB();
    
    // Check if test users already exist
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    const existingTeacher = await User.findOne({ email: 'teacher@test.com' });
    const existingStudent = await User.findOne({ email: 'student@test.com' });
    
    if (existingAdmin && existingTeacher && existingStudent) {
      console.log('✅ Test users already exist');
      return { admin: existingAdmin, teacher: existingTeacher, student: existingStudent };
    }
    
    console.log('👤 Creating test users...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUsers = [];
    
    // Create admin if doesn't exist
    if (!existingAdmin) {
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
        isActive: true
      });
      await admin.save();
      testUsers.push(admin);
      console.log('✅ Created admin user: admin@test.com / password123');
    } else {
      testUsers.push(existingAdmin);
    }
    
    // Create teacher if doesn't exist
    if (!existingTeacher) {
      const teacher = new User({
        firstName: 'John',
        lastName: 'Teacher',
        email: 'teacher@test.com',
        password: hashedPassword,
        role: 'teacher',
        isApproved: true,
        isActive: true,
        subject: 'English'
      });
      await teacher.save();
      testUsers.push(teacher);
      console.log('✅ Created teacher user: teacher@test.com / password123');
    } else {
      testUsers.push(existingTeacher);
    }
    
    // Create student if doesn't exist
    if (!existingStudent) {
      const student = new User({
        firstName: 'Jane',
        lastName: 'Student',
        email: 'student@test.com',
        password: hashedPassword,
        role: 'student',
        isApproved: true,
        isActive: true,
        studentId: 'ST001',
        gradeLevel: 'Intermediate'
      });
      await student.save();
      testUsers.push(student);
      console.log('✅ Created student user: student@test.com / password123');
    } else {
      testUsers.push(existingStudent);
    }
    
    return {
      admin: testUsers[0],
      teacher: testUsers[1],
      student: testUsers[2]
    };
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  }
}

async function testAnnouncementNotifications() {
  try {
    const users = await createTestUsers();
    
    console.log('\n📢 Testing announcement notification system...');
    
    // Simulate creating an announcement (this would normally be done through the API)
    await NotificationService.notifyAllUsersAnnouncement(
      new mongoose.Types.ObjectId(), // Fake announcement ID
      users.admin._id,
      'Welcome to the New Forum Academy Platform!'
    );
    
    console.log('✅ Created system-wide announcement notification');
    
    // Create a teacher-specific announcement
    await NotificationService.createBulkNotifications({
      recipients: [users.teacher._id],
      sender: users.admin._id,
      type: 'admin_announcement',
      title: 'Staff Meeting Reminder',
      message: 'Don\'t forget about the staff meeting tomorrow at 2 PM',
      priority: 'high',
      actionUrl: '/admin/announcements'
    });
    
    console.log('✅ Created teacher-specific announcement notification');
    
    // Create a student-specific announcement
    await NotificationService.createBulkNotifications({
      recipients: [users.student._id],
      sender: users.admin._id,
      type: 'admin_announcement',
      title: 'New Course Materials Available',
      message: 'New study materials have been uploaded for your English course',
      priority: 'medium',
      actionUrl: '/student/materials'
    });
    
    console.log('✅ Created student-specific announcement notification');
    
    console.log('\n🎉 Test completed successfully!');
    console.log('💡 You can now login with these test accounts and see the notifications:');
    console.log('   Admin: admin@test.com / password123');
    console.log('   Teacher: teacher@test.com / password123'); 
    console.log('   Student: student@test.com / password123');
    console.log('\n🔔 Check the notification panel in each dashboard to see the announcements!');
    
  } catch (error) {
    console.error('❌ Error testing announcement notifications:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
if (require.main === module) {
  testAnnouncementNotifications();
}

module.exports = { createTestUsers, testAnnouncementNotifications };