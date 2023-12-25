// Services
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const classifier = require('./nlu/classifier.js');

// Models
const Reply = require('./reply.js');

// Socket.io channels
const messageChannel = 'message';
const replyChannel = 'reply';

// Serve static files from the 'public' directory
app.use('/', express.static(path.join(__dirname, '/public')));

// Socket.io connection handling
io.on('connection', function (socket) {
  console.log("User connected to Chatbot");

  // Initial messages to the client
  socket.emit(replyChannel, new Reply("init", { name: "init1" }, "").toJson());
  socket.emit(replyChannel, new Reply("init", { name: "init2" }, "").toJson());

  // Handle incoming messages from the client
  socket.on(messageChannel, function (message, isUser, fn) {
    fn('Message arrived to the server'); // Callback function
    sendToBot(message, socket);
  });

  // Handle feedback from the client
  socket.on(replyChannel, function (message, intent, feedback) {
    console.log("Message: " + message + " | Intent: " + intent + " | Feedback: " + feedback);
  });
});

// Server setup
const port = 8000;
server.listen(port, function () {
  console.log('Chatbot is listening on port ' + port + '!');
});

// Function to send messages to the NLU classifier
sendToBot = function (message, socket) {
  classifier.parse(message, function (error, intent, entities) {
    if (error) {
      socket.emit(replyChannel, "An error has occurred: " + error);
    } else {
      socket.emit(replyChannel, new Reply(message, intent, entities).toJson());
    }
  });
};
