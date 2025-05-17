import express from "express";
import authenticateUser from "../../middlewares/authenticate-user.js";
import { signup } from "../../controllers/auth/functions/signup.js";
import { login } from "../../controllers/auth/functions/login.js";
import { loginLimiter, signupLimiter } from "./rate-limiters.js";

const router = express.Router();

router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);

// here’s your new verify route:
router.get("/verify", authenticateUser, (req, res) => {
  res.sendStatus(200);
});

export default router;
