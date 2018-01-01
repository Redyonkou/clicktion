TYPE=TRIGGERS
triggers='CREATE DEFINER=`user`@`%` TRIGGER create_emtpy_answers AFTER INSERT ON surveys\nFOR EACH ROW INSERT INTO `clicker_answers` (`id`) VALUES (NEW.id)'
sql_modes=1436549152
definers='user@%'
client_cs_names='utf8'
connection_cl_names='utf8_general_ci'
db_cl_names='latin1_swedish_ci'
created=151480555544
