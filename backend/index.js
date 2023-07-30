// Import required modules
const express = require('express'); // Express framework for handling HTTP requests
const mongoose = require('mongoose'); // MongoDB ODM for Node.js
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const path = require('path'); // Node.js module for working with file paths
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const { MONGO_URL } = require('./config'); // Configuration for MongoDB connection
const tweetRouter = require('./routers/tweet_router'); // Router for tweets-related endpoints
const userRouter = require('./routers/user_router'); // Router for user-related endpoints
const authRouter = require('./routers/auth_user'); // Router for authentication-related endpoints

const app = express(); // Create an instance of Express application
const port = 5000; // Port on which the server will listen

require('./models/user_model'); // Import the user model to register it with Mongoose
require('./models/tweets_model'); // Import the tweet model to register it with Mongoose

app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes
app.use(express.json()); // Parse incoming JSON data in request bodies

mongoose
  .connect(MONGO_URL) // Connect to the MongoDB server using the provided URL
  .then(() => {
    console.clear(); // Clear the console before displaying the message
    console.log('Connected To Mongoose'); // Log a success message after connecting to MongoDB
  })
  .catch((err) => {
    console.log(err); // Log an error if the connection to MongoDB fails
  });

app.use('/Images', express.static(path.join(__dirname, 'Images'))); // Serve static files from the 'Images' directory

app.use('/api/tweet', tweetRouter); // Route requests to '/api/tweet' to the tweetRouter
app.use('/api/auth', authRouter); // Route requests to '/api/auth' to the authRouter
app.use('/api/user', userRouter); // Route requests to '/api/user' to the userRouter

app.listen(port, () => console.log(`Server started on port ${port}!`)); // Start the server and log a message to confirm the port it's listening on
