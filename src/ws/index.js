// src/ws/index.js
import { Server as IOServer } from "socket.io";
import { consumer } from "../config/kafka/kafka.js";
import GroupChatMessage from "../models/groupChat/index.js";

let io;

export default async function startWebSocket(server) {
  io = new IOServer(server, {
    path: "/socket.io",
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket.IO client connected");
    socket.on("disconnect", () =>
      console.log("🔌 Socket.IO client disconnected")
    );
  });

  // subscribe & consume...
  await consumer.subscribe({ topic: "group-messages", fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const { sender, content } = JSON.parse(message.value.toString());
      const savedMsg = await GroupChatMessage.create({ sender, content }); //save msgs in db
      io.emit("newMessage", {
        _id: savedMsg._id,
        sender: savedMsg.sender,
        content: savedMsg.content,
        timestamp: savedMsg.timestamp,
      });
    },
  });

  console.log("✅ Socket.IO + Kafka consumer running");
}

export { io };
