const User = require("../models/User");

/**
 * @description Fetch a single user by ID.
 * @route GET /users/:id
 * @access Private (Admin or same user)
 *
 * @param {Object} req.params
 * @param {string} req.params.id - The ID of the user to fetch
 *
 * @returns {200} - Returns user object (id, username, email, etc.)
 * @returns {404} - If user is not found
 * @returns {500} - If a server error occurs
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @description Check if a username is already taken.
 * @route POST /users/check-username
 * @access Public
 *
 * @param {Object} req.body
 * @param {string} req.body.username - The username to check for availability
 *
 * @returns {200} - If username is available
 * @returns {400} - If username is not provided
 * @returns {409} - If username is already taken
 * @returns {500} - If a server error occurs
 */
exports.userNameAlreadyTaken = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username is required" });
    const user = await User.findOne({ attributes: ["id"], where: { username } });
    if (user) return res.status(409).json({ message: "Username already taken" });
    res.status(200).json({ message: "Username available" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};