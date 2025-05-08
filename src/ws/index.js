// src/ws/index.js
import { Server as IOServer } from "socket.io";
import { consumer } from "../config/kafka/kafka.js";
import GroupChatMessage from "../models/groupChat/index.js";

export default async function startWebSocket(server) {
  // attach Socket.IO to the same HTTP server
  const io = new IOServer(server, {
    path: "/socket.io",
    cors: { origin: "*" }, // adjust as needed
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket.IO client connected");
    socket.on("disconnect", () =>
      console.log("🔌 Socket.IO client disconnected")
    );
  });

  // subscribe to Kafka and on each message, both save & emit
  await consumer.subscribe({ topic: "group-messages", fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const { sender, content } = JSON.parse(message.value.toString());
      const savedMsg = await GroupChatMessage.create({
        senderId: sender,
        senderName: sender,
        content,
      });

      const payload = {
        _id: savedMsg._id,
        senderName: savedMsg.senderName,
        content: savedMsg.content,
        timestamp: savedMsg.timestamp,
      };

      // broadcast via Socket.IO
      io.emit("newMessage", payload);
    },
  });

  console.log("✅ Socket.IO + Kafka consumer running");
}
