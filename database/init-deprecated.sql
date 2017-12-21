DROP TABLE questions;
DROP TABLE lectures;

CREATE TABLE lectures (
	id VARCHAR(10) NOT NULL, 
	course VARCHAR(100) NOT NULL,
	semester VARCHAR(10) NOT NULL,
	professor VARCHAR(100) NOT NULL,
	state INT DEFAULT 0 NOT NULL,
	fullname VARCHAR(100),
	PRIMARY KEY(id, course, semester, professor)   
);

CREATE TABLE questions (
	id VARCHAR(10) NOT NULL,
	course VARCHAR(100) NOT NULL,
	semester VARCHAR(10) NOT NULL,
	professor VARCHAR(100) NOT NULL,
	title VARCHAR(100) NOT NULL,
	type VARCHAR(20) DEFAULT 'clicker',
	state INT DEFAULT 0 NOT NULL,
	date DATE,
	invite VARCHAR(4) NOT NULL UNIQUE,
	correct VARCHAR(100) NOT NULL,
	answer_A VARCHAR(100),
	answer_B VARCHAR(100),
	answer_C VARCHAR(100),
	answer_D VARCHAR(100),
	PRIMARY KEY (invite),
	CONSTRAINT chk_type CHECK (type IN ('clicker', 'text')),
	foreign key (id,course,semester,professor) references lectures(id,course,semester,professor) on delete cascade
);

INSERT INTO `lectures` (`id`, `course`, `semester`, `professor`, `fullname`) VALUES
('prg3', 'inf', '2017 WS', "riko", "Programmieren 3"),
('wt', 'inf', '2017 WS', 'riko', "Webtechnologien"),
('db', 'inf', '2017 WS', "hfg", "Datenbanken"),
('ad', 'inf', '2017 WS', "wmb", "Algorithmen und Datenstrukturen");

INSERT INTO `questions` (`id`, `course`, `semester`, `professor`, `invite`, `date`, `type`, `title`, `correct`, `answer_A`, `answer_B`, `answer_C`, `answer_D`) VALUES
('prg3', 'inf', '2017 WS', "riko", "3e8o", "2017-12-19", "clicker", "Was ist 1 + 1?", "B", "3", "2", "1", NULL),
('wt', 'inf', '2017 WS', 'riko', "r1wo", "2017-12-19", "text", "Was heißt HTML?", "Hyper Text Markup Language", NULL, NULL, NULL, NULL),
('wt', 'inf', '2017 WS', "riko", "n603", "2017-12-19", "clicker", "Ist <span> inline?", "A", "ja", "nein", NULL, NULL),
('ad', 'inf', '2017 WS', "wmb", "2b9t", "2017-12-19", "clicker", "Was ist die Worst-Case Laufzeit von Quicksort", "A", "O(n²)", "O(n*log(n))", "O(n)", "O(n!)");

