DROP TABLE clicker_answers;
DROP TABLE surveys;
DROP TRIGGER create_emtpy_answers;

CREATE TABLE surveys (
	creator VARCHAR(100) NOT NULL,
	title VARCHAR(100) NOT NULL,
	type VARCHAR(20) DEFAULT 'clicker',
	state INT DEFAULT 0 NOT NULL,
	date DATE,
	id VARCHAR(4) NOT NULL,
	correct_answer VARCHAR(100),
	answer_A VARCHAR(100),
	answer_B VARCHAR(100),
	answer_C VARCHAR(100),
	answer_D VARCHAR(100),
	PRIMARY KEY (id),
	CONSTRAINT chk_type CHECK (type IN ('clicker', 'text'))
);

CREATE TABLE clicker_answers (
	id VARCHAR(4) NOT NULL PRIMARY KEY,
	sum_A INT DEFAULT 0 NOT NULL,
	sum_B INT DEFAULT 0 NOT NULL,
	sum_C INT DEFAULT 0,
	sum_D INT DEFAULT 0,
	sum_all INT DEFAULT 0 NOT NULL,
	foreign key (id) references surveys(id) on delete cascade
);

DELIMITER $$
CREATE TRIGGER create_emtpy_answers AFTER INSERT ON surveys
FOR EACH ROW 
BEGIN
	IF NEW.answer_C IS NULL THEN
		SET @C = NULL;
	ELSE
		SET @C = 0;
	END IF;
	IF NEW.answer_D IS NULL THEN
		SET @D = NULL;
	ELSE
		SET @D = 0;
	END IF;
	INSERT INTO `clicker_answers` (`id`, `sum_C`, `sum_D`) VALUES (NEW.id, @C, @D);
END$$
DELIMITER ;

/*	IF NEW.answer_C = NULL THEN
		SET @C = NULL;
	ELSE
		SET @C = 0;
	END IF;
	IF NEW.answer_D = NULL THEN
		SET @D = NULL;
	ELSE
		SET @D = 0;
	END IF;*/

INSERT INTO `surveys` (`creator`, `id`, `date`, `type`, `title`, `correct_answer`, `answer_A`, `answer_B`, `answer_C`, `answer_D`) VALUES
("riko", "3e8o", "2017-12-19", "clicker", "Was ist 1 + 1?", NULL, "3", "2", "1", NULL),
("riko", "r1wo", "2017-12-19", "clicker", "Was heißt HTML?", "Hyper Text Markup Language", "NULL", NULL, NULL, NULL),
("wmb", "n603", "2017-12-19", "clicker", "Ist <span> inline?", "A", "ja", "nein", NULL, NULL),
("hfg", "2b9t", "2017-12-19", "clicker", "Was ist die Worst-Case Laufzeit von Quicksort", "A", "O(n²)", "O(n*log(n))", "O(n)", "O(n!)");
