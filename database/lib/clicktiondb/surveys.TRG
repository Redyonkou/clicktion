TYPE=TRIGGERS
triggers='CREATE DEFINER=`user`@`localhost` TRIGGER create_emtpy_answers AFTER INSERT ON surveys\nFOR EACH ROW \nBEGIN\nIF NEW.answer_C IS NULL THEN\nSET @C = NULL;\nELSE\nSET @C = 0;\nEND IF;\nIF NEW.answer_D IS NULL THEN\nSET @D = NULL;\nELSE\nSET @D = 0;\nEND IF;\nINSERT INTO `clicker_answers` (`id`, `sum_C`, `sum_D`) VALUES (NEW.id, @C, @D);\nEND'
sql_modes=1436549152
definers='user@localhost'
client_cs_names='latin1'
connection_cl_names='latin1_swedish_ci'
db_cl_names='latin1_swedish_ci'
created=151544635459
