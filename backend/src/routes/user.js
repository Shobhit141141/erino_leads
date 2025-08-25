const express = require("express");
const {
  getUserById,
  userNameAlreadyTaken,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", authMiddleware, getUserById);
router.post("/check-username", userNameAlreadyTaken);

module.exports = router;
