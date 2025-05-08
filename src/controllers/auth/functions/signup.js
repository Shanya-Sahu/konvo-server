import bcrypt from "bcrypt";
import { User } from "../../../models/user/index.js";
import { generateToken } from "../../../utils/jwt/index.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1) Validate payload
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required." });
    }

    // 2) Prevent duplicate emails
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // 3) Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4) Create new user with hashed password
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5) Issue JWT
    const token = generateToken({ id: user._id.toString() });

    // 6) Respond with public user data + token
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};
