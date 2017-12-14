var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/html/index.html');});

// always last get-handler! 
app.get('*', (req, res) => {
 	res.status(404).sendFile(__dirname + '/public/html/error.html');
}); 

// always last post-handler! 
app.post('*', (req, res) => {
 	res.status(400).sendFile(__dirname + '/public/html/error.html');
}); 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

