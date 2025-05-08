import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./src/config/kafka/ca.pem"), "utf-8")],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    mechanism: "plain",
  },
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chat-group" });

export async function initKafka() {
  await producer.connect();
  console.log("✅ Kafka producer connected");
  await consumer.connect();
  console.log("✅ Kafka consumer connected");
}
