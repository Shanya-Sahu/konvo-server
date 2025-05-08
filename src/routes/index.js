import express from "express";
import authRoutes from "./auth/index.js";
import authenticateUser from "../middlewares/authenticate-user.js";

const router = express.Router();

router.use("/auth", authRoutes);

// Anything below here is protected:
router.use(authenticateUser);

export default router;
