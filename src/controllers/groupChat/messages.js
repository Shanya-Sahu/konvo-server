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
    return res.status(202).json({ message: "Message sent to Kafka" });
  } catch (err) {
    console.error("❌ Kafka publish error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/v1/group/messages
 * Reads the last 100 messages from MongoDB
 */
export async function getGroupMessages(req, res) {
  try {
    // fetch the 100 oldest messages
    const docs = await GroupChatMessage.find()
      .sort({ timestamp: 1 })
      .limit(100)
      .lean(); // get plain JS objects

    // map to exactly what the front end expects
    const payload = docs.map((m) => ({
      _id: m._id,
      sender: m.sender,
      content: m.content,
      timestamp: m.timestamp,
    }));

    return res.status(200).json(payload);
  } catch (err) {
    console.error("❌ History fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
