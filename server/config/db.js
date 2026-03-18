const mongoose = require("mongoose");

/**
 * Connects to MongoDB with retry logic.
 * On failure, logs a warning but does NOT crash the server —
 * so the Express process stays alive for health checks.
 */
const connectDB = async () => {
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log(
        `✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`
      );
      return conn;
    } catch (error) {
      retries++;
      const delay = Math.min(1000 * 2 ** retries, 10000);
      console.error(
        `❌ MongoDB attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`
      );

      if (retries === MAX_RETRIES) {
        console.warn(
          "\n⚠️  Could not connect to MongoDB. Server will still run.\n" +
          "   → Fix: update MONGO_URI in server/.env to a valid connection string.\n" +
          "   → Get a free Atlas cluster at https://cloud.mongodb.com\n"
        );
        return null; // Don't crash — let Express keep running
      }

      console.log(`⏳ Retrying in ${delay / 1000}s…`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
