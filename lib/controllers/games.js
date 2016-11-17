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

exports.add = function (req, res, next) {
  return Game.findOneAndUpdate({ gameid: req.body.gameid }, req.body, { upsert: true }, function (err, games) {
    if (!err) {
      return res.json(games);
    } else {
      return res.send(err);
    }
  });
};

exports.remove = function (req, res, next) {
  return Game.remove({_id: req.params.id}, function (err, game) {
    if (!err) {
      return res.send(204);
    } else {
      return res.send(err);
    }
  });
};