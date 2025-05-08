import { WebSocketServer } from "ws";
import { consumer } from "../config/kafka/kafka.js";
import GroupChatMessage from "../models/groupChat/index.js";

export default async function startWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("✅ WebSocket client connected");
    ws.on("close", () => console.log("🔌 WebSocket client disconnected"));
  });

  await consumer.subscribe({ topic: "group-messages", fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ message }) => {
      let parsed;
      try {
        parsed = JSON.parse(message.value.toString());
      } catch (err) {
        console.error("⚠️ Invalid Kafka payload:", err);
        return;
      }

      const { sender, content } = parsed;

      try {
        // store `sender` string directly
        const savedMsg = await GroupChatMessage.create({
          senderId: sender,
          senderName: sender,
          content,
        });

        const payload = {
          event: "newMessage",
          data: {
            _id: savedMsg._id,
            senderName: savedMsg.senderName,
            content: savedMsg.content,
            timestamp: savedMsg.timestamp,
          },
        };

        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(payload));
          }
        });
      } catch (err) {
        console.error("⚠️ Error saving/broadcasting message:", err);
      }
    },
  });

  console.log("✅ WebSocket + Kafka consumer running");
}
