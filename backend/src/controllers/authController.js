const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CONSTANTS = require("../config/constants");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      CONSTANTS.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      secure: CONSTANTS.NODE_ENV === "dev" ? false : true,
      sameSite: CONSTANTS.NODE_ENV === "dev" ? "lax" : "none",
      domain: CONSTANTS.NODE_ENV === "dev" ? "" : ".shobhittiwari.me",
    });
    res.cookie(
      "user",
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
      {
        httpOnly: true,
        path: "/",
        secure: CONSTANTS.NODE_ENV === "dev" ? false : true,
        sameSite: CONSTANTS.NODE_ENV === "dev" ? "lax" : "none",
        domain: CONSTANTS.NODE_ENV === "dev" ? "" : ".shobhittiwari.me",
      }
    );
    res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      CONSTANTS.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      secure: CONSTANTS.NODE_ENV === "dev" ? false : true,
      sameSite: CONSTANTS.NODE_ENV === "dev" ? "lax" : "none",
      domain: CONSTANTS.NODE_ENV === "dev" ? "" : ".shobhittiwari.me",
    });
    res.cookie(
      "user",
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
      {
        httpOnly: true,
        path: "/",
        secure: CONSTANTS.NODE_ENV === "dev" ? false : true,
        sameSite: CONSTANTS.NODE_ENV === "dev" ? "lax" : "none",
        domain: CONSTANTS.NODE_ENV === "dev" ? "" : ".shobhittiwari.me",
      }
    );
    res.status(200).json({
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.status(200).json({ message: "Logged out successfully" });
};
