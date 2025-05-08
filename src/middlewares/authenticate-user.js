import { User } from "../models/user/index.js";
import { verifyToken } from "../utils/jwt/index.js";

const authenticateUser = async (req, res, next) => {
  try {
    // 1) Grab the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // 2) Extract token
    const token = authHeader.split(" ")[1];

    // 3) Verify & decode
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    }

    // 4) Lookup user in MongoDB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // 5) Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authenticateUser;
