const express = require('express');
const bodyParser = require('body-parser');
const tools = require('./tools');
const database = require('./routes/database.js');
const schedule = require('node-schedule');
const socket = require('socket.io');
var activeChannels = [];
var app = express();
var google = require('googleapis');
var server=require('http').createServer(app);
var io = socket(server);

/*----------------------------------------------------------*/

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/db', database);

/*----------------------------------------------------------*/

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/home.html');
});

app.get('/login', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/index.html');
});

app.get('/home', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/my_surveys.html');
});

app.get('/neue-umfrage', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/new_survey.html');
});

app.get('/survey', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/umfrage.html');
});

app.get('/time', (req, res) => {
	res.status(200).send(tools.calcServerDate());
});

/*----------------------------------------------------------*/

io.sockets.on('connection', (socket) => {
	console.log('new connection: ' + socket.id);

	socket.on('surveykey', key => {
		socket.join(key);
		console.log("User "+socket.id+" joint Raum "+key);
	});

	socket.on('disconnect', function(){
		console.log('user ' + socket.id + ' disconnected');
	});
});

/*----------------------------------------------------------*/

// always last get-handler! 
app.get('*', (req, res) => {
 	res.status(404).sendFile(__dirname + '/public/html/error.html');
});

// always last post-handler! 
app.post('*', (req, res) => {
 	res.status(400).sendFile(__dirname + '/public/html/error.html');
}); 

server.listen(3000, function () {
  console.log('server listening on port 3000!');
});
