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
  const initialReplies = [
    new Reply("init", { name: "init1" }, ""),
    new Reply("init", { name: "init2" }, "")
  ];
  initialReplies.forEach(reply => socket.emit(replyChannel, reply.toJson()));
  // Handle incoming messages from the client
  socket.on(messageChannel, function (message, isUser, fn) {
    fn('Message arrived to the server'); // Callback function
    sendToBot(message, socket);
  });
  // Handle feedback from the client
  socket.on(replyChannel, function (message, intent, feedback) {
    console.log(`Message: ${message} | Intent: ${intent} | Feedback: ${feedback}`);
  });
});
// Server setup
const port = process.env.PORT || 8000; // Use the port provided by the environment or default to 8000
server.listen(port, function () {
  console.log(`Chatbot is listening on port ${port}!`);
});
// Function to send messages to the NLU classifier
function sendToBot(message, socket) {
  classifier.parse(message, function (error, intent, entities) {
    if (error) {
      socket.emit(replyChannel, `An error has occurred: ${error}`);
    } else {
      socket.emit(replyChannel, new Reply(message, intent, entities).toJson());
    }
  });
}
