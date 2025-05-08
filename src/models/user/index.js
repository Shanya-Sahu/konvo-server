import mongoose from "mongoose";

// 1) Define the schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// 2) Create & export the model (fallback pattern)
export const User =
  mongoose.models["Konvo-User"] || mongoose.model("Konvo-User", userSchema);
