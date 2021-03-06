module.exports = function (mysql, connection, moment) {
  return {
    insert: function (title, content, checkDate, expDate, expCountdown, idArticle, callback) {

      // A externaliser
      var date = new Date();
      if (checkDate == 'date') {
        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        expDate = new Date(expDate.replace(pattern, '$3-$1-$2'));
        expDate.setHours(0);
        expDate.setMinutes(0);
        expDate.setSeconds(0);
      } else if (checkDate == 'duration') {
        date.setHours(parseInt(date.getHours()) + parseInt(expCountdown));
        expDate = date;
      }
      expDate = expDate.getFullYear() + "-" + (expDate.getMonth() + 1) + "-" + expDate.getDate() + " " + expDate.getHours() + ":" + expDate.getMinutes() + ":" + expDate.getSeconds();
      // ^^^^

      query = connection.query('INSERT INTO articles (title, content, expirationDate, idArticle) VALUES (?,?,?,?)', [title, content, expDate, idArticle], function res(err) {
        callback(err || null);
      });

    },

    checkUrl: function (urlToCheck, callback) {
      console.log('checkUrl');
      connection.query('SELECT idArticle, expirationDate FROM articles WHERE idArticle = ? LIMIT 1', [urlToCheck], function res(err, rows) {
        if (err) {
          return callback(err);
        }
        else if (rows[0] == undefined)
        {
          return callback('Cette id n\'existe pas');
        }
        callback(rows[0]);
      });
    },

    getArticle: function (idArticle, callback) {
      connection.query('SELECT * FROM articles WHERE idArticle = ?', [idArticle], function res(err, rows) {
        if (err) {
          return callback(err);
        }

        callback(rows[0]);
      });
    },

    'delete': function (idArticle, callback) {
      connection.query('DELETE FROM articles WHERE idArticle = "' + idArticle + '"', function (err) {
        callback(err || null);
      });
    }
  }
};
