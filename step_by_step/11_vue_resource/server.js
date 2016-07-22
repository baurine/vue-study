
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

var TODOS_FILE = path.join(__dirname, 'todos.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {

  console.log(req.path);

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Cache-Control', 'no-cache');

  // !!! important, I forget this line code, so the request pending there
  next();

});

app.get('/api/todos', function(req, res) {
  console.log(req.path);
  fs.readFile(TODOS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.listen(app.get('port'), function(){
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});