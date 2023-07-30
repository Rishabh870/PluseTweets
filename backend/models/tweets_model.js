const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tweetedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
      },
    ],
    retweetBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
      },
    ],
    image: {
      type: String,
      default: '',
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TweetModel',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TweetModel = mongoose.model('TweetModel', TweetSchema);

module.exports = TweetModel;
