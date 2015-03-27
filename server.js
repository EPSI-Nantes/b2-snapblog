
var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var reqmysql = require("./DAO/connection");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();

//app.use(express.bodyParser());
app.use(session({secret: 'todotopsecret'}));

app.get('/', function(req, res) { 
    res.render('index.ejs');
});


app.post('/', function(req, res){
	var titleart = req.body.article.titleart;
	var contentart = req.body.article.contentart;
	//var dateValue = req.body.checkDate;

	reqmysql.insertsql(titleart, contentart);

})

.use(express.static(__dirname + '/')) ;

app.listen(8080);

