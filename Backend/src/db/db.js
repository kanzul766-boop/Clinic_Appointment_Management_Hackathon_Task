import mongoose from "mongoose";

let connectionPromise;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (mongoose.connection.readyState === 2) {
    return mongoose.connection.asPromise();
  }
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(uri).then(() => {
    console.log("Connected to DB");
    return mongoose.connection;
  });
  try {
    return await connectionPromise;
  } finally {
    connectionPromise = null;
  }
}

export default connectDB;
