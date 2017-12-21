const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const tools = require('./tools');
const schedule = require('node-schedule');
const host = 'localhost';
var db, con;
var app = express();

/*----------------------------------------------------------*/

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

con = mysql.createConnection({
	host: host,
	user: 'user',
	password: 'dbpassword',
  	database: 'clicktiondb'
}).then((connection) => {
	db = connection;
	console.log("\x1b[32m%s\x1b[0m", "connection to mysql-container was successful");
}).catch((err) => {
	console.log("\x1b[31m%s\x1b[0m", "connection to mysql-container failed!");
});

var sched = schedule.scheduleJob('* * * * 8 *', () => {resetDatabase()});

/*----------------------------------------------------------*/

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
		var obj = result[0];
		res.status(200).json(obj);
	}).catch((err) => {
		console.log(err);
		res.status(400).send();
		throw (err);
	});  
});

/*
/* function: get all lectures by name
/* GET: <server>/db/lectures
/* Response: [{"id":"<lecture_id>","course":"<course_name>","semester":"<semester>", 
/* professor="<professor>", "fullname":"<lecture_name>"}, ...]
/* Expected Code: 200 Ok
*/
app.get('/db/lectures/:name', (req, res) => {
	con.then(() => {
		return db.query("SELECT * FROM lectures WHERE professor=? ORDER BY state DESC, id", [req.params.name]);
	}).then((result) => {
		var obj = result[0];
		res.status(200).json(obj);
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
		return db.query("SELECT * FROM questions ORDER BY state, date DESC");
	}).then((result) => {
		var obj = result[0];
		res.status(200).json(obj);
	}).catch((err) => {
		console.log(err);
		res.status(400).send();
		throw (err);
	});  
});

/*
/* function: get one lecture by invite
/* GET: <server>/db/lectures/<key>
/* Response: [{"id":"<lecture_id>","course":"<course_name>","semester":"<semester>", 
/* professor="<professor>", "fullname":"<lecture_name>"}]
/* Expected Code: 200 Ok
*/
app.get('/db/questions/:key', (req, res) => {
	con.then(() => {
		return db.query("SELECT * FROM questions q,lectures l WHERE  q.invite=? and l.state=1 and q.state=1 and l.id=q.id and l.professor=q.professor and l.course=q.course", [req.params.key]);
	}).then((result) => {
		var obj = result[0];
		if (result[0].length == 0) {
			res.status(404).send();
		} else {
			res.status(200).json(obj);
		}
	})
	.catch((err) => {
		console.log(err);
		res.status(404).send();
		throw (err);
	}); 
})

/**
/*	function: start one question
/*	POST: server/db/questions/start?name=<your_professor_name>&id=<id>&course=<course>&key=<invite>
/*	Response: no body, 200 Ok
*/
app.post('/db/questions/start', (req, res) => {
	con.then(() => {
		return db.query("UPDATE lectures SET state = 0 WHERE professor=?;", [req.query.name]);
	}).then(() => {
		return db.query("UPDATE lectures SET state = 1 WHERE professor=? and id=? and course=?;", [req.query.name,req.query.id,req.query.course]);
	}).then(() => {
		return db.query("UPDATE questions SET state = 0 WHERE professor=?;", [req.query.name]);
	}).then(() => {
		return db.query("UPDATE questions SET state = 1 WHERE professor=? and id=? and course=? and invite=?;", [req.query.name,req.query.id,req.query.course,req.query.key]);
	}).then(() => {
		res.status(200).send();
	}).catch((err) => {
		console.log(err);
		res.status(400).send();
		throw (err);
	});  
})

/**
/*	function: stop all questions for one professor
/*	POST: server/db/questions/stop?name=<your_professor_name>
/*	Response: no body, 200 Ok
*/
app.post('/db/questions/stop', (req, res) => {
	con.then(() => {
		return db.query("UPDATE lectures SET state = 0 WHERE professor=?;", [req.query.name]);
	}).then(() => {
		return db.query("UPDATE questions SET state = 0 WHERE professor=?;", [req.query.name]);
	}).then(() => {
		res.status(200).send();
	}).catch((err) => {
		console.log(err);
		res.status(400).send();
		throw (err);
	});
})

/**
/*	function: add new lecture
/*	PUT: server/db/lectures/new with body "name=<professor_name>&id=<lecture_id>&course=<course_name>&full=<fullname>"
/*	Response: no body, 200 Ok
*/
app.put('/db/lectures/new', (req, res) => {
	var id = req.body.id.toLowerCase(); var name = req.body.name.toLowerCase(); var course = req.body.course.toLowerCase(); 
	var fullname = req.body.full; var semester = tools.calcSemester();
	con.then(() => {
		return db.query("INSERT INTO `lectures` (`id`, `professor`, `course`, `semester`, `fullname`) VALUES (?,?,?,?,?);", [id,name,course,semester,fullname]);
	}).then((result) => {
		res.status(201).send();
	}).catch((err) => {
		console.log(err);
		if (JSON.stringify(err).includes("Duplicate entry"))
			res.status(409).send();
		else 
			res.status(400).send();
		throw (err);
	}); 
})

/**
/*	function: add new question
/*	PUT: server/db/questions/new with body "name=<professor_name>&id=<lecture_id>&course=<course_name>&title=<title>&type=<type>&correct=<correct_answer>&a=<Answer_A>&b=<Answer_B>&c=<Answer_C>&d=<Answer_D>"
/*	Response: no body, 200 Ok
*/
app.put('/db/questions/new', (req, res) => {
	var id = req.body.id.toLowerCase(); var name = req.body.name.toLowerCase(); var course = req.body.course.toLowerCase(); 
	var semester = tools.calcSemester(); var title = req.body.title;
	var invite = tools.generateKey(); var date = new Date(); var type = req.body.type; var correct = req.body.correct;
	var A = req.body.a;	var B = req.body.b;	var C = req.body.c;	var D = req.body.d;
	con.then(() => {
		return db.query("INSERT INTO `questions` (`id`, `professor`, `course`, `semester`, `invite`, `title`, `date`, `type`, `correct`, `answer_A`, `answer_B`, `answer_C`, `answer_D`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);", [id,name,course,semester,invite,title,date,type,correct,A,B,C,D]);
	}).then((result) => {
		res.status(201).send();
	}).catch((err) => {
		console.log(err);
		if (JSON.stringify(err).includes("Duplicate entry"))
			res.status(409).send();
		else 
			res.status(400).send();
		throw (err);
	}); 
})

function resetDatabase() {
	con.then(() => {
		return db.query("TRUNCATE TABLE lectures");
	}).then(() => {
		return db.query("TRUNCATE TABLE questions");
	}).then(() => {
		console.log("\x1b[42m\x1b[30m%s\x1b[0m", "DATABASE was successfully RESET");
	}).catch((err) => {
		console.log(err);
		throw (err);
	}); 
}

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