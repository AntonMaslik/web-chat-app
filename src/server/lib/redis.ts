import Redis from "ioredis";
import { clearRedisInit } from "./clearRedisInit";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: (process.env.REDIS_PORT as unknown as number) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: (process.env.REDIS_NUMBER as unknown as number) || 0,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis");

  clearRedisInit();
});
