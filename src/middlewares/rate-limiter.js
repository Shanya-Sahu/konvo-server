// Import the express-rate-limit package to control repeated requests
import rateLimit from "express-rate-limit";

// A function to create and return a rate limiter with custom settings
const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // Time window in milliseconds (default: 15 minutes)
  max = 100, // Maximum number of allowed requests in that window (default: 100)
  message = "Too many requests, please try again later.", // Message shown when limit is exceeded
} = {}) => {
  // Return a configured rate limiter middleware
  return rateLimit({
    windowMs, // Time frame to count requests
    max, // Max allowed requests in the time frame
    standardHeaders: true, // Adds standard rate-limit headers (RateLimit-*)
    legacyHeaders: false, // Disables old headers like X-RateLimit-*
    message, // Custom error message shown on rate limit hit
  });
};

// Export the function to use it in other files
export default createRateLimiter;
