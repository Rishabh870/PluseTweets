// Import required modules and models
const express = require("express");
const TweetModel = require("../models/tweets_model");
const router = express.Router();
const protectedRoute = require("../middleware/verifyToken");
const authUser = require("../middleware/verifyToken");
const getUpload = require("../utilities/multer");

// Route to create a new tweet
router.post(
  "/post",
  authUser, // Middleware to verify the user's authentication
  getUpload("tweetImg").single("tweetImg"), // Middleware for handling image upload
  async (req, res) => {
    try {
      const { content } = req.body;
      const image = req.file?.path; // Get the image path from the multer middleware
      const userId = req.userId._id;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      // Create a new tweet in the database
      const newTweet = new TweetModel({
        content: content,
        tweetedBy: userId,
        image: image,
      });
      await newTweet.save();

      res.status(200).json({ newTweet });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Route to like a tweet
router.post("/:id/like", authUser, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const userId = req.userId._id;
    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (tweet.likes.includes(userId)) {
      return res.status(400).json({ error: "You already liked this tweet" });
    }

    // Add the user's ID to the likes array of the tweet
    tweet.likes.push(userId);
    await tweet.save();

    res.status(200).json({ tweet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to dislike a tweet
router.post("/:id/dislike", authUser, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const userId = req.userId._id;
    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (!tweet.likes.includes(userId)) {
      return res.status(400).json({ error: "You have not liked this tweet" });
    }

    // Remove the user's ID from the likes array of the tweet
    tweet.likes = tweet.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
    await tweet.save();

    res.status(200).json({ tweet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to reply to a tweet
router.post("/:id/reply", authUser, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const userId = req.userId._id;
    const { content } = req.body;

    const tweet = await TweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Create a new reply to the tweet
    const newReply = new TweetModel({
      content: content,
      tweetedBy: userId,
    });

    await newReply.save();

    // Add the new reply's ID to the replies array of the original tweet
    tweet.replies.push(newReply._id);
    await tweet.save();

    res.status(200).json({ newReply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a tweet by ID
router.get("/:id", authUser, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const tweet = await TweetModel.findById(tweetId)
      .populate("tweetedBy", "-password")
      .populate("likes", "-password")
      .populate("retweetBy", "-password")
      .populate({
        path: "replies",
        populate: [
          { path: "tweetedBy", select: "-password" },
          { path: "likes", select: "-password" },
          { path: "replies", select: "-password" },
          { path: "retweetBy", select: "-password" },
        ],
      })
      .exec();

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    res.status(200).json(tweet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all tweets
router.get("/", authUser, async (req, res) => {
  try {
    const tweets = await TweetModel.find()
      .sort({ createdAt: -1 })
      .populate("tweetedBy", "-password")
      .populate("likes", "-password")
      .populate("retweetBy", "-password")
      .populate({
        path: "replies",
        populate: { path: "tweetedBy", select: "-password" },
      })
      .exec();

    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a tweet by ID
router.delete("/:id", authUser, async (req, res) => {
  try {
    const tweetId = req.params.id;

    // Find the tweet by ID and check if it exists
    const tweet = await TweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Check if the logged-in user is the creator of the tweet
    if (tweet.tweetedBy.toString() !== req.userId._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this tweet" });
    }

    // Delete the tweet
    await TweetModel.findByIdAndDelete(tweetId);

    res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to retweet a tweet
router.post("/:id/retweet", authUser, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const userId = req.userId._id.toString();

    const tweet = await TweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (tweet.retweetBy.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You already retweeted this tweet" });
    }

    // Add the user's ID to the retweetBy array of the tweet
    tweet.retweetBy.push(userId);
    await tweet.save();

    res.status(200).json({ tweet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
