import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Print the MongoDB URI (for debugging)
    console.log("=================================");
    console.log("Mongo URI:", process.env.MONGO_URI);
    console.log("=================================");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;