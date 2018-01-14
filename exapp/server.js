const express = require('express');
const bodyParser = require('body-parser');
const tools = require('./tools');
const database = require('./routes/database.js');
const schedule = require('node-schedule');
var activeChannels = [];
var app = express();
var google = require('googleapis');

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

app.get('/time', (req, res) => {
	res.status(200).send(tools.calcServerDate());
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

app.listen(3000, function () {
  console.log('server listening on port 3000!');
});