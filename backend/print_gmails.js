import mongoose from 'mongoose';
import User from './src/models/user.model.js';

const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/zStudentHub');
  const users = await User.find({}).select('name email');
  console.log(`Found ${users.length} users.`);
  if (users.length === 0) {
    console.log('No users found in the database.');
  } else {
    users.forEach(u => {
      console.log(`${u.name}: ${u.email}`);
    });
  }
  await mongoose.connection.close();
};

run();
