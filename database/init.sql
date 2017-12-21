DROP TABLE surveys;

CREATE TABLE surveys (
	creator VARCHAR(100) NOT NULL,
	title VARCHAR(100) NOT NULL,
	type VARCHAR(20) DEFAULT 'clicker',
	state INT DEFAULT 0 NOT NULL,
	date DATE,
	invite VARCHAR(4) NOT NULL,
	correct VARCHAR(100) NOT NULL,
	answer_A VARCHAR(100),
	answer_B VARCHAR(100),
	answer_C VARCHAR(100),
	answer_D VARCHAR(100),
	PRIMARY KEY (invite),
	CONSTRAINT chk_type CHECK (type IN ('clicker', 'text'))
);

INSERT INTO `surveys` (`creator`, `invite`, `date`, `type`, `title`, `correct`, `answer_A`, `answer_B`, `answer_C`, `answer_D`) VALUES
("riko", "3e8o", "2017-12-19", "clicker", "Was ist 1 + 1?", "B", "3", "2", "1", NULL),
("riko", "r1wo", "2017-12-19", "text", "Was heißt HTML?", "Hyper Text Markup Language", NULL, NULL, NULL, NULL),
("wmb", "n603", "2017-12-19", "clicker", "Ist <span> inline?", "A", "ja", "nein", NULL, NULL),
("hfg", "2b9t", "2017-12-19", "clicker", "Was ist die Worst-Case Laufzeit von Quicksort", "A", "O(n²)", "O(n*log(n))", "O(n)", "O(n!)");