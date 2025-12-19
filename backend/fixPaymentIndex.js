import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixPaymentIndex = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("payments");

    console.log("Checking existing indexes...");
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Drop the problematic transactionId index
    try {
      console.log("Dropping transactionId_1 index...");
      await collection.dropIndex("transactionId_1");
      console.log("✓ Successfully dropped transactionId_1 index");
    } catch (err) {
      if (err.code === 27) {
        console.log("Index transactionId_1 doesn't exist (already fixed)");
      } else {
        throw err;
      }
    }

    // Create the new sparse index
    console.log("Creating new sparse index for transactionId...");
    await collection.createIndex(
      { transactionId: 1 },
      { unique: true, sparse: true }
    );
    console.log("✓ Successfully created sparse index");

    console.log("\nFinal indexes:");
    const finalIndexes = await collection.indexes();
    console.log(finalIndexes);

    console.log("\n✅ Payment model indexes fixed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing indexes:", err);
    process.exit(1);
  }
};

fixPaymentIndex();