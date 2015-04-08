
var mysql = require('mysql');
var func = require("../functions");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'snapblog'
});

var insertPost = function (title,content,checkDate,expDate,expCountdown,idArticle, callback){  
		var date = new Date();
		console.log(date);

	if(checkDate == 'date')
	{
		var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
		expDate = new Date(expDate.replace(pattern,'$3-$1-$2'));
		expDate.setHours(0);
		expDate.setMinutes(0);
		expDate.setSeconds(0);
	}
	else if (checkDate == 'duration')
	{
		date.setHours(parseInt(date.getHours())+parseInt(expCountdown));
    	expDate = date;
	}


//var test = makeid();

	expDate = expDate.getFullYear() + "-" + (expDate.getMonth()+1) + "-" + expDate.getDate()+ " " +expDate.getHours() + ":" + expDate.getMinutes() + ":" + expDate.getSeconds();

	console.log(title, content, checkDate, expDate, expCountdown, idArticle);

	query = connection.query('INSERT INTO articles (title, content, expirationDate, idArticle) VALUES ("'+title+'","'+content+'","'+expDate+'","'+idArticle+'")', function res(err) {

		if(err)
		{
    		callback(err);
    	}
    	else
    	{
    		callback("it works");
    	}
  });
  
};


var checkUrl = function (urlToCheck, callback){ 
	query = connection.query('SELECT idArticle FROM articles WHERE idArticle = "' + urlToCheck + '"', function res(err, rows) {	
		if (rows){
    		callback(rows[0]);
		}
		else
		{
			callback (null);
		}
    
  });
  
};

var getArticle = function (idArticle, callback){  
	console.log("ID: " + idArticle);
	query = connection.query('SELECT * FROM articles WHERE idArticle = "' + idArticle + '"', function res(err, rows) {	
		if (rows){
    		callback(rows[0]);
		}
    
  });
  
};

var deleteArticle = function(idArticle){
	query = connection.query('DELETE FROM articles WHERE idArticle = "' + idArticle + '"');
}

exports.getArticle = getArticle;
exports.checkUrl = checkUrl;
exports.insertPost = insertPost;
exports.deleteArticle = deleteArticle;