import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 60 requests per 1 minute
export const publicApiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/public",
});

// Stricter limiter for checkouts (5 per min per user)
export const checkoutLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/checkout",
});

// Admin limiter (higher throughput)
export const adminLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(200, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/admin",
});
