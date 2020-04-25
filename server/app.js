const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
})
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("new client connected");
    
    socket.on("disconnect", () => {
        console.log("client disconnected");
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))