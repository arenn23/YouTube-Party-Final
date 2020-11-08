const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path');


const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)

const io = socketio(server)

app.use(express.static(path.join(__dirname, '/client/build')));
let fileLoc = ''

if (process.env.NODE_ENV === 'production') fileLoc = path.join(__dirname + '/client/public/index.html');
else fileLoc = path.join(__dirname + '/client/public/index.html');



app.get('/', (req, res) => {
  res.sendFile(fileLoc)
});

let connectedRooms = {}
let mapSocket = {}

io.on('connection', (socket) => {
  console.log('Client connected!')
  
  io.emit('this', {will: 'be received by everyone'})

  socket.on('register', msg => {
    const id = msg.id;
    console.log(`Registering room #${id} for ${socket.id}`)
    socket.join(`Room #${id}`)
    mapSocket[socket.id] = id
    
    if (!(id in connectedRooms)){
      connectedRooms[id] = {}
      connectedRooms[id].roomies = []

    }
    connectedRooms[id].roomies.push(msg.roomies)
    console.log(connectedRooms[id].roomies)
    io.in(`Room #${id}`).emit('syncRoomies', {roomies: connectedRooms[id].roomies})
    if (!(connectedRooms[id].queue === undefined)){
    io.in(`Room #${id}`).emit('syncQueue', connectedRooms[id]);
    }
  })

  socket.on('syncStatus', msg => {
    try{
    const id = mapSocket[socket.id]
    socket.to(`Room #${id}`).emit('syncStat', {msg});
    }catch{}
  })

  socket.on('pause', msg => {
    const id = mapSocket[socket.id]
    if(msg){
    connectedRooms[id].pause = msg.pause
    socket.to(`Room #${id}`).emit('pause', {pause: connectedRooms[id].pause});
  }})

  socket.on('reset', msg => {
    const id = mapSocket[socket.id]
    io.in(`Room #${id}`).emit('reset', msg);
  })

  socket.on('play', msg => {
    const id = mapSocket[socket.id]
    if(msg){
    connectedRooms[id].play = msg.play
    socket.to(`Room #${id}`).emit('play', {play: connectedRooms[id].play});
  }})

  socket.on('syncQueue', msg => {
    try {
      const id = mapSocket[socket.id]
      connectedRooms[id].queue = msg.queue;
      io.in(`Room #${id}`).emit('syncQueue', connectedRooms[id]);
  }
  catch (err) {
  }
})

socket.on('loadFromQueue', msg => {
  const id = mapSocket[socket.id]
  connectedRooms[id].song = msg.song;
  io.in(`Room #${id}`).emit('loadFromQueue', connectedRooms[id].song);
})

socket.on('ended',  msg => {
  const id = mapSocket[socket.id]
  connectedRooms[id].currURL = msg.currURL
  io.in(`Room #${id}`).emit('loadFromQueue', connectedRooms[id].currURL);
})

})

server.listen(PORT , () => console.log(`Server running on port ${PORT}`))