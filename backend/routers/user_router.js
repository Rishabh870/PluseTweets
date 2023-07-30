const express = require('express');
const UserModel = require('../models/user_model');
const TweetModel = require('../models/tweets_model');
const router = express.Router();
const authUser = require('../middleware/verifyToken');
const getUpload = require('../utilities/multer');

// Get user data by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract required user data for response
    const userData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      location: user.location,
      DOB: user.DOB,
      follower: user.follower,
      following: user.following,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow a user by ID
router.post('/:id/follow', authUser, async (req, res) => {
  try {
    const followId = req.params.id;
    const userId = req.userId;

    if (followId === userId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const userLoggedIn = await UserModel.findById(userId);
    const userToFollow = await UserModel.findById(followId);

    if (!userLoggedIn || !userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userLoggedIn.following.includes(userToFollow._id)) {
      return res
        .status(400)
        .json({ error: 'You are already following this user' });
    }

    // Add the userToFollow ID to the following array of the logged-in user
    userLoggedIn.following.push(userToFollow);
    await userLoggedIn.save();

    // Add the logged-in user's ID to the follower array of the user being followed
    userToFollow.follower.push(userLoggedIn);
    await userToFollow.save();

    res.status(200).json({ message: 'User followed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow a user by ID
router.post('/:id/unfollow', authUser, async (req, res) => {
  try {
    const unfollowId = req.params.id;
    const userId = req.userId;

    if (unfollowId === userId) {
      return res.status(400).json({ error: 'You cannot unfollow yourself' });
    }

    const userLoggedIn = await UserModel.findById(userId);
    const userToUnfollow = await UserModel.findById(unfollowId);

    if (!userLoggedIn || !userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!userLoggedIn.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ error: 'You are not following this user' });
    }

    // Remove the user ID from the following array of the logged-in user
    userLoggedIn.following = userLoggedIn.following.filter(
      (userId) => userId.toString() !== userToUnfollow._id.toString()
    );
    await userLoggedIn.save();

    // Remove the logged-in user's ID from the follower array of the user being unfollowed
    userToUnfollow.follower = userToUnfollow.follower.filter(
      (followerId) => followerId.toString() !== userLoggedIn._id.toString()
    );
    await userToUnfollow.save();

    res.status(200).json({ message: 'User unfollowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user details by ID
router.put('/:id', authUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, dob, location } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!name || !dob || !location) {
      return res
        .status(400)
        .json({ error: 'Name, DOB, and location are required fields' });
    }

    // Update user details
    user.name = name;
    user.DOB = dob;
    user.location = location;
    await user.save();

    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tweets by user ID
router.get('/:id/tweets', authUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch tweets and populate relevant fields with user details, excluding password field
    const tweets = await TweetModel.find({ tweetedBy: userId })
      .populate('tweetedBy', '-password')
      .populate('likes', '-password')
      .populate('retweetBy', '-password')
      .populate('replies', '-password')
      .sort({ createdAt: -1 });

    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload user profile picture by ID
router.post(
  '/:id/uploadProfilePic',
  authUser,
  getUpload('profileImg').single('profilePic'),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (req.file) {
        // Update user profile picture
        user.profilePic = req.file.path;
        await user.save();
        res.status(200).json({ message: 'Profile picture updated' });
      } else {
        res.status(400).json({
          error: 'Please upload a valid image file (jpg, jpeg, png).',
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
