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
// ibos code
var Session = require('express-session');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
const ClientID = "933668699455-rg2ubpr3cb04chop74ddr6j8blcs4bat.apps.googleusercontent.com";
const ClientSecret = "MqRQvTHSjiK-b8MArGLY6G8C";
const RedirectionUrl = "http://localhost:3000/oauthCallback";

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

app.get('/statistics', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/statistics.html');
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

// ibos code

var app = express();
app.use(Session({
    secret: 'pizzaisnotagoodkey',
    resave: true,
    saveUninitialized: true
}));

function getOAuthClient () {
    return new OAuth2(ClientID , ClientSecret, RedirectionUrl);
}

function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
      'https://www.googleapis.com/auth/plus.me'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
}

app.use("/oauthCallback", function (req, res) {

    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.       FEHLER HIER Token wird gespeichert
      if(!err) {
        oauth2Client.setCredentials(tokens);
        session["tokens"]=tokens;
        res.send(`
            <h3>Login successful!!</h3>
            <a href="/details">Go to details page</a>
        `);
      }
      else{
        res.send(`
            <h3>Login failed!!</h3>
        `);
      }
    });
});

app.use("/details", function (req, res) {
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(req.session["tokens"]);

    var p = new Promise(function (resolve, reject) {
        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
            resolve(response || err);
        });
    }).then(function (data) {
        res.send(`
            <img src=${data.image.url}/>
            <h3>Hello ${data.displayName}</h3>
        `);
    })
});

app.use("/", function (req, res) {
    var url = getAuthUrl();
    res.send(`<h1>Authentication using google oAuth</h1>
        <a href="${url}">Login</a>`);
});

