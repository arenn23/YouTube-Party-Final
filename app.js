const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

const io = socketio(server);

app.use(express.static(path.join(__dirname, "/client/build")));
let fileLoc = "";

//Shows server which file to find in production mode.
if (process.env.NODE_ENV === "production")
  fileLoc = path.join(__dirname + "/client/build/index.html");
else fileLoc = path.join(__dirname + "/client/build/index.html");

app.get("*", (req, res) => {
  res.sendFile(fileLoc);
});

//connectedRooms stores all important data in it
let connectedRooms = {};
//mapSocket stores the room id and socket.id in the following format: {socket.id: room id}
//room id is the name of the room. Socket.id is a unique id given to every socket client
let mapSocket = {};

//io.on looks for a new client to connect
io.on("connection", (socket) => {
  console.log("Client connected!");

  io.emit("this", { will: "be received by everyone" });

  //As soon as a client`s room component mounts, the data is sent to the server. socket.on means data received. Socket.emit means
  //data sent
  socket.on("register", (msg) => {
    //room id
    const id = msg.id;
    console.log(`Registering room #${id} for ${socket.id}`);
    //joing the room
    socket.join(`Room #${id}`);
    mapSocket[socket.id] = id;

    //If this is a new room id (ie not already in the connectedRooms object), then an object is made in the connectedRooms object with the
    //room id as the key.
    if (!(id in connectedRooms)) {
      connectedRooms[id] = {};
      //roomies array inside object made structure: [roomie1, roomie1]
      connectedRooms[id].roomies = [];
      //socket roomie array made. Structure [{socket.id: id}]
      connectedRooms[id].socketRoomie = [];
    }
    //adds new roomie to array
    connectedRooms[id].roomies.push(msg.roomies);
    var socketID = socket.id;

    //Gets newest roomie in roomie array
    var connectedRoomiesLength =
      connectedRooms[id].roomies[connectedRooms[id].roomies.length - 1];

    //Stores newest roomie with socket.id in socketRoomie array
    connectedRooms[id].socketRoomie.push({
      [socketID]: connectedRoomiesLength,
    });

    // if (connectedRooms[id].roomies === 1) {
    //   io.in(`Room #${id}`).emit("resetRoom", msg);
    //  }

    //Emits to other clients updates roomie array
    io.in(`Room #${id}`).emit("syncRoomies", {
      roomies: connectedRooms[id].roomies,
    });

    //Sends updated queue to other roomies. does this need to be here?
    if (!(connectedRooms[id].queue === undefined)) {
      io.in(`Room #${id}`).emit("syncQueue", connectedRooms[id]);
    }
  });

  //Server receives data once one client pauses or plays video.
  socket.on("sync", (msg) => {
    //Gets the room id from the mapSocket object using the socket.id as the key. This is done in almost every function on the server side
    //This allows data to only be sent to other members of the same room.
    //Example mapSocket = {socket.id1: 'room1', socket.id2: 'room1', socket.id3, 'room2' }
    // mapSocket[socket.id1] = 'room1' Then everyone else in room1 will be emitted.
    const id = mapSocket[socket.id];
    //Created time stamp to get how much time has passed during data transfer. Allows all video to stay exactly synced.
    //emits data to room
    socket.to(`Room #${id}`).emit("sync", { msg });
  });

  // socket.on("reset", (msg) => {
  //   const id = mapSocket[socket.id];
  //   io.in(`Room #${id}`).emit("reset", msg);
  // });

  //Fires when one client updates the queue.
  socket.on("syncQueue", (msg) => {
    try {
      const id = mapSocket[socket.id];
      //Adds queue object to connectedRooms[id] object
      connectedRooms[id].queue = msg.queue;
      io.in(`Room #${id}`).emit("syncQueue", connectedRooms[id]);
    } catch (err) {}
  });

  //Fires when client selects from queue for next video
  socket.on("loadFromQueue", (msg) => {
    const id = mapSocket[socket.id];
    io.in(`Room #${id}`).emit("loadFromQueue", msg);
  });

  //Fires when video ends
  socket.on("ended", (msg) => {
    const id = mapSocket[socket.id];
    connectedRooms[id].currURL = msg.currURL;
    connectedRooms[id].queue = msg.queue;
    io.in(`Room #${id}`).emit("ended", connectedRooms[id]);
  });

  //Fires when someone leaves the room
  socket.on("disconnect", () => {
    try {
      const id = mapSocket[socket.id];
      //shorten for later use
      let roomies = connectedRooms[id].roomies;

      //loops through socketRoomie object
      for (i = 0; i < connectedRooms[id].socketRoomie.length; i++) {
        //X is the object inside the socketRoomie array at idex i
        var x = connectedRooms[id].socketRoomie[i];
        //Checks to see if that key matches the socket.id of the person that just left
        if (Object.keys(x)[0] === socket.id) {
          //Gets index of roomie name in the roomies array
          var index = roomies.indexOf(Object.values(x)[0]);
          //Splices out the roomie name that just left
          index > -1 ? roomies.splice(index, 1) : false;
        }
      }
      //Updates the roomies that remained in the room with the updated spliced list.
      io.in(`Room #${id}`).emit("syncRoomies", {
        roomies: connectedRooms[id].roomies,
      });
    } catch (err) {
      console.log(`Socket ${socket.id} not found`);
    }
    console.log(`Disconnected with ${socket.id}`);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
