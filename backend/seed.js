const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Attendance = require('./models/Attendance');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'employee',
        employeeId: 'EMP002',
        department: 'Marketing'
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'employee',
        employeeId: 'EMP003',
        department: 'Sales'
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'manager',
        employeeId: 'MGR001',
        department: 'Engineering'
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: hashedPassword,
        role: 'employee',
        employeeId: 'EMP004',
        department: 'Engineering'
      }
    ]);

    console.log('Created 5 users');

    // Create sample attendance records for the past 30 days
    const today = new Date();
    const attendanceRecords = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Create records for first 4 employees (non-managers)
      for (let j = 0; j < 4; j++) {
        const random = Math.random();
        let status = 'present';
        let checkInTime = null;
        let checkOutTime = null;
        let totalHours = 8;

        if (random < 0.1) {
          // 10% absent
          status = 'absent';
          checkInTime = null;
          checkOutTime = null;
          totalHours = 0;
        } else if (random < 0.2) {
          // 10% late
          status = 'late';
          checkInTime = '10:15';
          checkOutTime = '18:45';
          totalHours = 8.5;
        } else {
          // 80% present
          status = 'present';
          checkInTime = '09:00';
          checkOutTime = '17:30';
          totalHours = 8.5;
        }

        attendanceRecords.push({
          userId: users[j]._id,
          date: dateStr,
          checkInTime,
          checkOutTime,
          status,
          totalHours
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('Test Credentials:');
    console.log('===============\n');
    console.log('Employee:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123\n');
    console.log('Employee:');
    console.log('  Email: jane@example.com');
    console.log('  Password: password123\n');
    console.log('Manager:');
    console.log('  Email: bob@example.com');
    console.log('  Password: password123\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedData();
