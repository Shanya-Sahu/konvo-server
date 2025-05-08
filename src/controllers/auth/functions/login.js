import { User } from "../../../models/user/index.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/jwt/index.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required." });
    }

    // 2) check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 3) Compare
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password not matched" });
    }

    // 4) Issue token
    const token = generateToken({ id: user._id.toString() });

    // 5) Respond
    res.json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};
