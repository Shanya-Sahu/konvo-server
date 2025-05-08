// src/routes/groupChat/index.js

import express from "express";
import {
  postGroupMessage,
  getGroupMessages,
} from "../../controllers/groupChat/messages.js";

const router = express.Router();

// Everyone posts to /api/v1/group/messages
router.post("/messages", postGroupMessage);

// Everyone GETs /api/v1/group/messages for history
router.get("/messages", getGroupMessages);

export default router;
