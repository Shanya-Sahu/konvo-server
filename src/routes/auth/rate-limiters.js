import createRateLimiter from "../../middlewares/rate-limiter.js";

// Create a rate limiter for login requests
export const loginLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // Allow requests within a 10-minute window
  max: 5, // Allow only 5 login attempts in that window
  message: "Too many login attempts. Please try again in 10 minutes.", // Custom message
});

// Create a rate limiter for signup requests
export const signupLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 20, // Allow up to 20 signup attempts in that window
  // No custom message here, so it will use the default message from the middleware
});
