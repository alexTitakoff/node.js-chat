var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
server.listen(process.env.PORT || 3002);
console.log('Server running');
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
io.sockets.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);


  //Disconnect
	socket.on('disconnect', function(data) {
    //if(!socket.username) return;
    users.slice(users.indexOf(socket.username), 1);
    updateUserNames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets disconnected', connections.length);
	});


  //Send Message
	socket.on('send message', function(data) {
    console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});


  //New users
  socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
  });


  function updateUserNames() {

    io.sockets.emit('get users', users);
  }

});
