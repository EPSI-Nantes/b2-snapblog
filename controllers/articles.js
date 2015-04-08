'use strict';

module.exports = function (ArticleRepository) {
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

        res.redirect('http://localhost:8080/' + idArticle);

      });
    }
  };
};
