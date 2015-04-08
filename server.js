'use strict';

var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require("passport");
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

var app = express();
var func = require("./functions");
var FacebookStrategy = require('passport-facebook').Strategy;
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'snapblog'
});
connection.connect();
var ArticleRepository = require("./DAO/ArticleRepository")(connection);
var controllers = require('./controllers');
var articleControllers = controllers.articles(ArticleRepository);

passport.use('facebook', new FacebookStrategy({
    clientID: '944762712255296',
    clientSecret: '1674335fbc04589c124dcecf508c9064',
    callbackURL: '/auth/facebook/callback'
  },
  function (accessToken, refreshToken, profile, callback) {
    ProfileRepository.update(profile, accessToken, refreshToken, callback);
    // http://dev.mysql.com/doc/refman/5.6/en/insert-on-duplicate.html
  }
));

app
  .use(session({
    secret: 'snapblog'
  }))
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(passport.initialize())
  .get('/', function (req, res) {
    msg = "";
    res.render('index.ejs', {
      message: msg
    });
  })
  .get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  })
  .get('/test', function (req, res) {
    console.log("**************************");
    console.log(req.user.fb.firstName);
    res.render('test', {
      user: req.user
    });
  })
  .get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['user_friends', 'publish_actions']
  }))
  .get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/test');
    })
  .post('/articles', articleControllers.create)
  .get('/articles/:articleId', function (req, res) {
    // @todo
    // Articles.retrieve(req.params.articleId, function (err, article) {
    //   // article => JSON | false
    //   // JSON => article
    //   // false => l'article a expiré
    // });

    ArticleRepository.checkUrl(req.params.articleId, function callback(result) {
      if (!result) {
        color = "white";
        msg = "Cet article n'existe pas";
        res.render('index.ejs', {
          message: msg
        });
      } else if (result) {
        ArticleRepository.getArticle(result.idArticle, function callback(result) {
          if (result.expirationDate > new Date()) {
            var title = result.title;
            var content = result.content;
            console.log('content : ', content);
            res.render('article.ejs', {
              title: title,
              content: func.nl2br(content)
            });
          } else {
            ArticleRepository.deleteArticle(result.idArticle);
            color = "white";
            console.log(color);
            msg = "Cet article a exipré";
            res.render('index.ejs', {
              message: msg,
              color: color
            });
          }
        });
      }

    })
  })
  .use(express.static(__dirname + '/public'))
  .listen(8080);
