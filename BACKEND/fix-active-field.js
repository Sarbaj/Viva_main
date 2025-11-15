// Script to fix any existing results with incorrect active field type
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resultModel } from './model/AllModel.js';

dotenv.config();

const fixActiveField = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all results
    const results = await resultModel.find({});
    console.log(`Found ${results.length} results`);

    let fixed = 0;
    for (const result of results) {
      let needsUpdate = false;
      let updates = {};

      // Check if active is a string instead of boolean
      if (typeof result.active === 'string') {
        updates.active = result.active === 'true' || result.active === 'True';
        needsUpdate = true;
        console.log(`Result ${result._id}: Converting active from string "${result.active}" to boolean ${updates.active}`);
      }

      // Ensure active is boolean
      if (result.active !== true && result.active !== false) {
        updates.active = false; // Default to submitted if unclear
        needsUpdate = true;
        console.log(`Result ${result._id}: Setting active to false (was ${result.active})`);
      }

      if (needsUpdate) {
        await resultModel.updateOne({ _id: result._id }, updates);
        fixed++;
      }
    }

    console.log(`\n✅ Fixed ${fixed} results`);
    console.log(`✅ ${results.length - fixed} results were already correct`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixActiveField();
