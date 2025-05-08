import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
// import rateLimit from "express-rate-limit";

import { connectDB } from "./src/config/db/connect-db.js";
import { initKafka, producer, consumer } from "./src/config/kafka/kafka.js";
import startWebSocket from "./src/ws/index.js";

import authRoutes from "./src/routes/auth/index.js";
import groupChatRoutes from "./src/routes/groupChat/index.js";
import authMiddleware from "./src/middlewares/authenticate-user.js";

async function main() {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Setup Express
    const app = express();
    const server = http.createServer(app);

    app.use(express.json());
    app.use(cors());
    app.use(helmet());

    // 3️⃣ Public + protected routes
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/group", authMiddleware, groupChatRoutes);

    // 4️⃣ Health check
    app.get("/", (_req, res) => res.send("🚀 KonvoApp API online!"));

    // 5️⃣ Start HTTP server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server listening at http://localhost:${PORT}`);
    });

    // 6️⃣ Start WebSocket server
    await startWebSocket(server);
    console.log("✅ Socket.IO server running");

    // 7️⃣ Initialize Kafka (producer + consumer)
    await initKafka();
    console.log("✅ Kafka producer + consumer connected");

    // 8️⃣ Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("🔌 Gracefully shutting down...");
      await consumer.disconnect();
      await producer.disconnect();
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Fatal startup error:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Fatal error starting server:", err);
  process.exit(1);
});
