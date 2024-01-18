import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongodb connected at ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`mongodb Error ${error}`);
  }
};

export default connectDB;
