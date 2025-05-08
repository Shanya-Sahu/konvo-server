// models/groupChat/index.js
import mongoose from "mongoose";

const GroupChatSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("GroupChatMessage", GroupChatSchema);
