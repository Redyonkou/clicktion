var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
const tools = require('../tools');
const schedule = require('node-schedule');
const host = 'localhost';
var db, con;

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

/**
/* function: get all surveys
/* GET: <server>/db/allSurveys
/* Response: [{ creator="<your_name>", "title":"<actual_question>",
/* "type":"<type>","state":"<state>", "date":"<creation_date>",
/* "id":"<question_key>", "correct":"<correct_answer>","answer_A":"<Answer_A>", 
/* "answer_B":"<Answer_B>", "answer_C":"<Answer_C>", 
/* "answer_D":"<Answer_D>"}, ...]
/* Expected Code: 200 Ok
*/
router.get('/all', (req, res) => {
	con.then(() => {
		return db.query("SELECT * FROM surveys ORDER BY creator, title");
	}).then((result) => {
		var obj = result[0];
		res.status(200).json(obj);
	}).catch((err) => {
		console.log(err);
		res.sendStatus(400).end();
		throw (err);
	}); 
});

/**
/* function: get all surveys by creator
/* GET: server/db/my
/* Response: [{ creator="<your_name>", "title":"<actual_question>",
/* "type":"<type>","state":"<state>", "date":"<creation_date>",
/* "id":"<question_key>", "correct":"<correct_answer>","answer_A":"<Answer_A>", 
/* "answer_B":"<Answer_B>", "answer_C":"<Answer_C>", 
/* "answer_D":"<Answer_D>"}, ...]
/* Expected Code: 200 Ok
*/
router.get('/my', (req, res) => {
	var name = "riko";
	console.log(req.get('Authorization'));
	//TO-DO: call decryption function!
	con.then(() => {
		return db.query("SELECT * FROM surveys WHERE creator=? ORDER BY state DESC, date", [name]);
	}).then((result) => {
		var obj = result[0];
		res.status(200).json(obj);
	}).catch((err) => {
		console.log(err);
		res.sendStatus(400).end();
		throw (err);
	});
});

/**
/*	function: start one survey
/*	POST: server/db/start?id=<key> with Header Authorization
/*	Response: no body
/* 	Expected Code: 200 Ok
*/
router.post('/start', (req, res) => {
	var name = "riko";
	console.log(req.get('Authorization'));
	//TO-DO: call decryption function!
	con.then(() => {
		return db.query("UPDATE surveys SET state = 0 WHERE creator=? and state != 2;", [name]);
	}).then(() => {
		return db.query("UPDATE surveys SET state = 1 WHERE creator=? and id=?;", [name,req.query.id]);
	}).then(() => {
		res.sendStatus(200).end();
	}).catch((err) => {
		console.log(err);
		res.sendStatus(400).end();
		throw (err);
	});
})

/**
/*	function: stop all surveys for one creator
/*	POST: server/db/stop with Authorization Header
/*	Response: no body
/* 	Expected Code: 200 Ok
*/
router.post('/stop', (req, res) => {
	var name = "test";
	console.log(req.get('Authorization'));
	//TO-DO: call decryption function!
	con.then(() => {
		return db.query("UPDATE surveys SET state = 2 WHERE creator=? and state = 1;", [name]);
	}).then(() => {
		return db.query("UPDATE surveys SET state = 0 WHERE creator=? and state != 2;", [name]);
	}).then(() => {
		res.sendStatus(200).end();
	}).catch((err) => {
		console.log(err);
		res.sendStatus(400).end();
		throw (err);
	});
})

/**
/*	function: add new survey
/*	PUT: server/db/new 
/*  with body "title=<title>&type=<type>&correct=<correct_answer>&
/*	a=<Answer_A>&b=<Answer_B>&c=<Answer_C>&d=<Answer_D>" 
/*  with Authorization Header
/*	Response: no body
/* 	Expected Code: 200 Ok
*/
router.put('/new', (req, res) => {
	var name = "test";
	console.log(req.get('Authorization'));
	//TO-DO: call decryption function!
	var title = req.body.title; var id = tools.generateKey(); var date = tools.calcServerDate(); 
	var type = req.body.type; var correct_answer = req.body.correct;
	var answers = [req.body.a,req.body.b,req.body.c,req.body.d];
	answers = tools.normalizeAnswers(answers,correct_answer);
	console.log(answers+" - "+correct_answer);
	if (false){
	con.then(() => {
		return db.query("INSERT INTO `surveys` (`creator`, `id`, `title`, `date`, `type`, `correct_answer`, `answer_A`, `answer_B`, `answer_C`, `answer_D`) VALUES (?,?,?,?,?,?,?,?,?,?);", [name,id,title,date,type,correct_answer,answers[0],answers[1],answers[2],answers[3]]);
	}).then((result) => {
		res.sendStatus(201).end();
	}).catch((err) => {
		console.log(err);
		res.sendStatus(400).end();
		throw (err);
	}); 
	} else {
		res.sendStatus(400).end();
	}
})

/**
/*	function: submit answer
/*	POST: server/db/submit?id=<invite_key>&answer=<answer>
/*	Response: no body
/* 	Expected Code: 200 Ok
*/
router.post('/submit', (req, res) => {
	var id = req.query.id; var answer = req.query.answer;
	if ("abcd".includes(answer)){
	con.then(() => {
		return db.query("UPDATE clicker_answers SET sum_all = sum_all + 1 WHERE id=? and (SELECT state FROM surveys WHERE id=?)=1;", [id,id]);
	}).then(() => {
		return db.query("UPDATE clicker_answers SET sum_"+answer+" = sum_"+answer+" + 1 WHERE id=? and sum_"+answer+"!= NULL and (SELECT sv.state FROM surveys sv WHERE sv.id=?)=1;", [id,id]);
	}).then((result) => {
		res.sendStatus(200).end();
	}).catch((err) => {
		console.log(err);
		res.sendStatus(400).end();
		throw (err);
	});
	} else {
		res.sendStatus(400).end();
	}
})

/**
/*	function: get survey-results
/*	GET: server/db/results?id=<invite_key>
/*	Response: [{'correct':'<correct_answer>','sum_A':'<sum_of_a>','sum_B':'<sum_of_b>',
/*	'sum_C':'<sum_of_c>','sum_D':'<sum_of_d>','sum_all':'<sum_of_all>'}]
/* 	Expected Code: 200 Ok
*/
router.get('/results', (req, res) => {
	var id = req.query.id;
	con.then(() => {
		return db.query("SELECT sv.correct_answer,ca.sum_A,ca.sum_b,ca.sum_c,ca.sum_d,ca.sum_all FROM clicker_answers ca, surveys sv WHERE ca.id=? and sv.id=? and sv.state = 2;", [id,id]);
	}).then((result) => {
		var obj = result[0];
		res.status(200).json(obj);
	}).catch((err) => {
		console.log(err);
		res.sendŚtatus(400).end();
		throw (err);
	});
})

/**
/* function: get one survey by invite-key
/* GET: server/db/survey?id=<id>
/* Response: [{"title":"<actual_question>","answer_A":"<Answer_A>", 
/* "answer_B":"<Answer_B>", "answer_C":"<Answer_C>", 
/* "answer_D":"<Answer_D>"}]
/* Expected Code: 200 Ok
*/
router.get('/survey', (req, res) => {
	con.then(() => {
		return db.query("SELECT * FROM surveys sv WHERE  sv.id=? and sv.state = 1", [req.query.id]);
	}).then((result) => {
		var obj = result[0];
		if (result[0].length == 0) {
			res.sendStatus(404).end();
		} else {
			res.status(200).json(tools.normalizeSurvey(obj));
		}
	})
	.catch((err) => {
		console.log(err);
		res.sendStatus(404).end();
		throw (err);
	}); 
})

function resetDatabase() {
	con.then(() => {
		return db.query("TRUNCATE TABLE surveys");
	}).then(() => {
		tools.resetKeys();
		console.log("\x1b[42m\x1b[30m%s\x1b[0m", "DATABASE was successfully RESET");
	}).catch((err) => {
		console.log(err);
		throw (err);
	}); 
}

var sched = schedule.scheduleJob('* * * * 8 *', () => {resetDatabase()});

module.exports = router;