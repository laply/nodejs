const { names } = require('debug');
// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('chat');
});

var count = 1;
var userNames = {}
io.on('connection', function(socket) {
    console.log('user connected: ', socket.id);
    var newName = "user" + count++;
    socket.name = newName;
    io.to(socket.id).emit('create name', socket.id, newName);
    io.to(socket.id).emit('new_connect', socket.id, newName, userNames);

    userNames[socket.id] = newName;
    io.emit('new_connect_user', socket.id, newName);

    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket.id + ' ' + socket.name);
        delete userNames[socket.id];
        io.emit('new_disconnect', socket.id, socket.name, userNames);
    });

    socket.on('send message', function(id, name, text) {
        var msg = name + ' : ' + text;
        if (socket.name != name) {
            socket.name = name;
            userNames[id] = name;
            io.emit('replace name', userNames);
        }

        console.log(msg);
        io.emit('receive message', msg);
    });

});

http.listen(3000, function() {
    console.log('server on..');
});