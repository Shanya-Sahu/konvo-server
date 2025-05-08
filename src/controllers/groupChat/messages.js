// src/controllers/groupChat/messages.js

import GroupChatMessage from "../../models/groupChat/index.js";
import { producer } from "../../config/kafka/kafka.js";

/**
 * POST /api/v1/group/messages
 * Publishes to Kafka; DB‐write happens in your WS consumer
 */
export async function postGroupMessage(req, res) {
  const { sender, content } = req.body;
  if (
    !sender ||
    typeof sender !== "string" ||
    !content ||
    typeof content !== "string"
  ) {
    return res.status(400).json({
      error: "Both 'sender' and 'content' are required strings.",
    });
  }

  try {
    await producer.send({
      topic: "group-messages",
      messages: [{ value: JSON.stringify({ sender, content }) }],
    });
    res.status(202).json({ message: "Message sent to Kafka" });
  } catch (err) {
    console.error("❌ Kafka publish error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/v1/group/messages
 * Reads the last 100 messages from MongoDB
 */
export async function getGroupMessages(req, res) {
  try {
    const msgs = await GroupChatMessage.find()
      .sort({ timestamp: 1 })
      .limit(100);
    res.status(200).json(msgs);
  } catch (err) {
    console.error("❌ History fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
