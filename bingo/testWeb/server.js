var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('main', {
        title: 'online bingo',
    });
});

var users = {};
var user_count = 0;
var turn_count = 0;

io.on('connection', function(socket) {
    console.log('user connected: ', socket.id);

    socket.username = 'user' + user_count;
    users[user_count] = {};
    users[user_count].id = socket.id;
    users[user_count].name = username;
    users[user_count].turn = false;
    user_count++;

    io.emit('update_users', users, user_count);

    socket.on('game_start', function(data) {
        socket.broadcast.emit("game_started", data);
        users[turn_count].turn = true;

        io.emit('update_users', users);
    });

    socket.on('select', function(data) {
        socket.broadcast.emit("check_number", data);

        users[turn_count].turn = false;
        turn_count++;

        if (turn_count >= user_count) turn_count = 0;

        users[turn_count].turn = true;
        io.sockets.emit('update_users', users);
    });

    socket.on('game_end', function(name) {
        console.log("winner is : ", name);
        socket.broadcast.emit("winner", name);
    });

    socket.on('game_reset', function() {
        console.log("reset game");
        socket.broadcast.emit("game_reset");
    });

    socket.on('disconnect', function() {
        console.log('user disconnected :', socket.id, socket.username);

        for (var i = 0; i < user_count; i++) {
            if (users[i].id == socket.id) delete users[i];
        }

        user_count--;
        io.emit('updata_users', users, user_count);
    });
});

http.listen(3000, function() {
    console.log('server on');
});