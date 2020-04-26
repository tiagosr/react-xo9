const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const chance = require('chance').Chance();

const port = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
})
const server = http.createServer(app);
const io = socketIo(server);

const other_player = {
    X: "O",
    O: "X"
}
let connections = {}
let rooms = {}

io.on("connection", (socket) => {
    console.log("new client connected");
    connections[socket.id] = {socket: socket, room: null, player: "X", name: ""}

    socket.on("new-game", (name) => {
        let room_token = chance.word();
        connections[socket.id].room = room_token;
        connections[socket.id].name = name;
        rooms[room_token] = [{ player: connections[socket.id], id: socket.id }];
        socket.join(room_token);
        socket.emit('room', room_token, 'X');
    })

    socket.on('join-game', (room, name) => {
        if (io.sockets.adapter.rooms[room]) {
          socket.join(room);
          connections[socket.id].room = room;
          connections[socket.id].name = name;
          connections[socket.id].player = "O";
          rooms[room].push({player: connections[socket.id], id: socket.id });
          socket.emit("room", room, "O");
          io.to(room).emit("players", )
          io.to(room).emit("your-move", "X");
        } else {
          socket.error("no-room");
        }
    })

    socket.on("move", (move) => {
        const room = connections[socket.id].room;
        const player = connections[socket.id].player;
        if (room) {
          io.to(room).emit("move", player, move);
          io.to(room).emit("your-move", other_player[player]);
        } else {
          socket.error("no-room");
        }
    })

    socket.on("disconnect", () => {
        console.log("client disconnected");
        const room = connections[socket.id].room;
        if (room) {
            rooms[room] = rooms[room].filter((player)=>player.id !== socket.id);
            if (rooms[room].length === 0) {
                delete rooms[room];
            }
        }
        delete connections[socket.id];
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`));