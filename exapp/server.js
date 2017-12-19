var express = require('express');
const mysql = require('mysql2/promise');
var bodyParser = require('body-parser');
var tools = require('./tools');
const host = 'localhost';
var db, con;
var app = express();

con = mysql.createConnection({
	host: host,
	user: 'user',
	password: 'dbpassword',
  	database: 'clicktiondb'
}).then((connection) => {
	db = connection;
	console.log("\x1b[32mconnection to database was successful");
	console.log("\x1b[37m", "");	
}).catch((err) => {
	console.log("\x1b[31mconnection to database failed!");
	console.log("\x1b[37m", "");	
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/home.html');
});

app.get('/login', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/index.html');
});

app.get('/new-lecture', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/new_lecture.html');
});

app.get('/semester', (req, res) => {
	res.status(200).send(tools.calcSemester());
});

/*----------------------------------------------------------*/

/*
/* function: get all lectures
/* GET: <server>/db/lectures
/* Response: [{"id":"<lecture_id>","course":"<course_name>","semester":"<semester>", 
/* professor="<professor>", "fullname":"<lecture_name>"}, ...]
/* Expected Code: 200 Ok
*/
app.get('/db/lectures', (req, res) => {
	con.then(() => {
		return db.query("SELECT * FROM lectures ORDER BY professor, id");
	}).then((result) => {
		var obj = JSON.stringify(result[0]);
		res.status(200).send(obj);
	}).catch((err) => {
		console.log(err);
		res.status(400).send();
		throw (err);
	});  
});

/*
/* function: get all questions
/* GET: <server>/db/questions
/* Response: [{"id":"<lecture_id>","course":"<course_name>","semester":"<semester>", 
/* professor="<professor>", "title":"<actual_question>","type":"<type>","state":"<state>",
/* "date":"<creation_date>","invite":"<question_key>", "correct":"<correct_answer>","answer_A":"<Answer_A>", 
/* "answer_B":"<Answer_B>", "answer_C":"<Answer_C>", 
/* "answer_D":"<Answer_D>"}, ...]
/* Expected Code: 200 Ok
*/
app.get('/db/questions', (req, res) => {
	con.then(() => {
		return db.query("SELECT * FROM questions ORDER BY state, date");
	}).then((result) => {
		var obj = JSON.stringify(result[0]);
		res.status(200).send(obj);
	}).catch((err) => {
		console.log(err);
		res.status(400).send();
		throw (err);
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

app.listen(3000, function () {
  console.log('server listening on port 3000!');
});