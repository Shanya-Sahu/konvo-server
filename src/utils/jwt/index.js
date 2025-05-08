import jwt from "jsonwebtoken";

export const generateToken = (
  payload,
  expiresIn = process.env.JWT_EXPIRES_IN || "1d"
) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};
