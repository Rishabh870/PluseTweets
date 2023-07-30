const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    DOB: {
      type: Date,
      default: null,
    },
    follower: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;
