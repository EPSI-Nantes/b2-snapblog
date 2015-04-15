'use strict';

var express = require('express');
var moment = require('moment');
var session = require('cookie-session');
var mysql = require('mysql');
var func = require("./functions");
var bodyParser = require('body-parser');
var passport = require("passport");
var mongoose = require('mongoose');
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});
var port = 8080;
var app = express();
var FacebookStrategy = require('passport-facebook').Strategy;
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'snapblog'
});
var ArticleRepository = require("./DAO/ArticleRepository")(mysql,connection,moment);
var ProfileRepository = require("./DAO/ProfileRepository")(mysql,connection);
var controllers = require('./controllers');
var articleControllers = controllers.articles(ArticleRepository, func, mysql);


    var UserSchema = new mongoose.Schema({
        facebookId: {
            type: String
        },
        access_token: {
            type: String
        },
    });

    UserSchema.statics.findOrCreate = function(filters, cb) {
        User = this;
        this.find(filters, function(err, results) {
            if(results.length == 0) {
                var newUser = new User();
                newUser.facebookId = filters.facebookId;
                newUser.save(function(err, doc) {
                    cb(err, doc)
                });
            } else {
                cb(err, results[0]);
            }
        });
    };

var User = mongoose.model('User', UserSchema);



passport.use('facebook', new FacebookStrategy({
    clientID: '944762712255296',
    clientSecret: '1674335fbc04589c124dcecf508c9064',
    callbackURL: '/auth/facebook/callback'
  },
  function (accessToken, refreshToken, profile, callback) {
    ProfileRepository.update(profile, accessToken, refreshToken, callback);
    // http://dev.mysql.com/doc/refman/5.6/en/insert-on-duplicate.html
    User.findOrCreate(
      { facebookId: profile.id },
      function (err, result) {
        if(result) {
            result.access_token = accessToken;
            result.save(function(err, doc) {
                done(err, doc);
            });
        } else {
            done(err, result);
        }
      }
    );
  }
));

connection.connect();

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
    var msg = "";
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
  .get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: [] }))

  .get('/auth/facebook/callback',
        passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
        function(req, res) {
          res.redirect("/profile?access_token=" + req.user.access_token);
        }
    ) 

  .post('/articles/post', articleControllers.create)
  .get('/articles/:articleId', articleControllers.retrieve) 
  .get('/profile', passport.authenticate('bearer', { session: false }), function(req, res) {
        res.send("LOGGED IN as " + req.user.facebookId + " - <a href=\"/logout\">Log out</a>");
    }
)
    // @todo
    // Articles.retrieve(req.params.articleId, function (err, article) {
    //   // article => JSON | false
    //   // JSON => article
    //   // false => l'article a expiré
    // });


   /* ArticleRepository.checkUrl(req.params.articleId, function callback(result) {
      if (!result) {
        var color = "white";
        var msg = "Cet article n'existe pas";
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
              content: content
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

    })          */
  
  .use(express.static(__dirname + '/public'))
  .listen(port);
  console.log('The magic happens on port ' + port);