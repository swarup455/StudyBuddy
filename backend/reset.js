import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/db/database.js";
import { Message } from "./src/models/message.model.js";
import { User } from "./src/models/user.model.js";
import { Channel } from "./src/models/channel.model.js";

dotenv.config({ path: "./.env" });

const resetCollections = async () => {
  try {
    await connectDB();

    // Delete all documents
    await Message.deleteMany({});
    await User.deleteMany({});
    await Channel.deleteMany({});

    console.log("✅ Cleared Message, User, and Channel collections successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error clearing collections:", err);
    process.exit(1);
  }
};

resetCollections();