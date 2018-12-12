var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
app.use(express.static(__dirname+"/client"));
io.on('connection', function (socket) {
    socket.on('receive', (msg) => {
        socket.broadcast.emit('message', msg);
    });
});
server.listen(8081, '10.11.60.60');


