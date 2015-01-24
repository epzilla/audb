'use strict';

var mongoose = require('mongoose'),
    Game = mongoose.model('Game');

exports.show = function (req, res, next) {
  return Game.find({Season: req.params.season}, function (err, games) {
    if (!err) {
      return res.json(games);
    } else {
      return res.send(err);
    }
  });
};