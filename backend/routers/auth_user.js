// Import required modules and models
const express = require('express');
const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const authUser = require('../middleware/verifyToken');

// Route for user registration
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if the username or email already exists in the database
    const existingUsernameUser = await UserModel.findOne({ username });
    const existingEmailUser = await UserModel.findOne({ email });

    if (existingEmailUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    if (existingUsernameUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    newUser.save();

    // Respond with user data without the hashed password
    const userData = {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    };

    res.status(200).json({ userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    // Find the user by either email or username
    const user = await UserModel.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    });

    // If the user is not found, return a generic error message without specifying the reason
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return a generic error message without specifying the reason
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token and send it back along with the user ID
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    return res.status(200).json({ token: token, userId: user._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
