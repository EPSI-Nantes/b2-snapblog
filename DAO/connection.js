
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'snapblog'
});


var insertsql = function (titleart, contentart){
	connection.connect();

	connection.query('INSERT INTO article(titleArticle, contentArticle) VALUES(' + titleart + ',' + contentart + ')', function(err, fields) {
	  if (!err)
	    console.log('Done !');
	  else
	    console.log('Error !');
	});

	connection.end();
};


exports.insertsql = insertsql;
