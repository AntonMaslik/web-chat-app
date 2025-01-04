import { redis } from "./redis";

export function saveMessageInRedis(message: string) {
  redis.rpush("messages", message);
  redis.ltrim("messages", -1000, -1);
}
