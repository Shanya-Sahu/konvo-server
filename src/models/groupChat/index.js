import mongoose from "mongoose";

const GroupChatMessageSchema = new mongoose.Schema({
  // change type to String so “user” or any text will be accepted
  senderId: {
    type: String,
    required: true,
  },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("GroupChatMessage", GroupChatMessageSchema);
