// public/app.js

const SimplePeer = require('simple-peer');

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  let peer = null;

  // Handle chat messages
  const form = document.querySelector('form');
  const input = document.querySelector('#m');
  const messages = document.querySelector('#messages');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  socket.on('chat message', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    messages.appendChild(li);
  });

  // Handle video/audio calls
  const startButton = document.getElementById('startButton');
  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');

  startButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideo.srcObject = stream;
        peer = new SimplePeer({ initiator: true, stream });
         
        peer.on('signal', (data) => {
          socket.emit('call', { signal: data });
        });

        peer.on('stream', (stream) => {
          remoteVideo.srcObject = stream;
        });

        socket.on('call', (data) => {
          peer.signal(data.signal);
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  });

  // Handle hang up
  const hangupButton = document.getElementById('hangupButton');
  hangupButton.addEventListener('click', () => {
    if (peer) {
      peer.destroy();
      localVideo.srcObject = null;
      remoteVideo.srcObject = null;
    }
  });
});
