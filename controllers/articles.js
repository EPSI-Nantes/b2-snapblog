'use strict';

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'snapblog'
});
var func = require("../functions");
var ArticleRepository = require("../DAO/ArticleRepository")(mysql,connection);
var moment = require('moment');

module.exports = function (ArticleRepository, func, mysql) {
  return {
    create: function (req, res) {
      var title = req.body.titleArticle;
      var content = req.body.content;
      var checkDate = req.body.checkDate;
      var expDate = req.body.expirationDate;
      var expCountdown = req.body.expirationCountdown;
      var idArticle = func.makeid(20);
      console.log("ID:" + idArticle);
      ArticleRepository.insert(title, content, checkDate, expDate, expCountdown, idArticle, function callback(result) {
        //msg="Votre article a été posté";
        //res.render('index.ejs', {message: msg});

      res.redirect('http://localhost:8080/articles/' + idArticle);

      });
    },

    retrieve: function(req, res) {
      console.log("---------RETRIEVE---------");
      var articleId = req.params.articleId;
      console.log(articleId)
      ArticleRepository.checkUrl(articleId, function callback(result){
          if (result.idArticle>=moment().format('YYYY-MM-dd hh:mm:ss'))
          {
            this.delete();
            res.redirect('http://localhost:8080');
          }
          else
          {
            ArticleRepository.getArticle(result.idArticle, function callback(result2) {
                console.log("RESULT GETARTICLE");
                console.log(result2);
                res.render('article.ejs', {
                  title: result2.title,
                  content: result2.content
                });
            });
          }

        console.log(result);
      })
    },

    delete: function(req, res) {



    }


  };
};
