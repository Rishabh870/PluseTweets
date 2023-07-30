// Import required modules and libraries
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UserModel = require('../models/user_model');

// Middleware function for user authentication
const authUser = (req, res, next) => {
  // Extract the 'Authorization' header from the request
  const { authorization } = req.headers;

  // Check if the 'Authorization' header is missing
  if (!authorization) {
    return res.status(401).json({ error: 'User Not Logged In' });
  }

  // Extract the token from the 'Authorization' header
  const token = authorization.replace('Bearer ', '');

  try {
    // Verify the JWT token
    jwt.verify(token, JWT_SECRET, (error, payload) => {
      // If there's an error during token verification, return an error response
      if (error) {
        return res.status(401).json({ error: 'User Not Logged In' });
      }

      // Extract the user ID from the payload
      const { _id } = payload;

      // Find the user in the database based on the user ID from the token
      UserModel.findById(_id).then((userId) => {
        // Attach the user ID to the request object for further use in other middleware or routes
        req.userId = userId;

        // Call the next middleware or route handler
        next();
      });
    });
  } catch (error) {
    // If an error occurs during the try-catch block, return an invalid token error response
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Export the authentication middleware function
module.exports = authUser;
