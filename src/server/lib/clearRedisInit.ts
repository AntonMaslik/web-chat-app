import { redis } from "./redis";

export function clearRedisInit() {
  redis.flushall();
}
