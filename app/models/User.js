'use_strict'; 

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

exports.UserSchema = UserSchema;
