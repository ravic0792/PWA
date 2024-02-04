const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve your PWA
app.use(express.static('public'));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle video/audio calls
  socket.on('call', (data) => {
    io.emit('call', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
