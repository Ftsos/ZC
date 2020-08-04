const uuid = require("uuid");
const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const ejs = require("ejs")
const port = 8080;
const { PeerServer } = require('peer');
 
app.set("view engine", "ejs")


app.get("/", (req, res) => {
	res.sendFile(__dirname + "/publics/index.html")
})

app.get("/room/:room", (req, res) => {
	console.log(req.params.room)
	res.render('room', { roomId: req.params.room })
})

app.get("/js/script.js", (req, res) => {
	res.sendFile(__dirname + "/publics/script.js")
})

io.on("connection", (socket) => {
	socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

const peerServer = PeerServer({ port: 8081, path: '/peer' });

server.listen(port)

console.log("server listening on port " + port)