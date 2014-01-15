'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Game = mongoose.model('Game'),
    Player = mongoose.model('Player'),
    Recruit = mongoose.model('Recruit');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

exports.year = function(req, res) {
  return Game.find({Season: req.params.season}, function (err, games) {
    if (!err) {
      return res.json(games);
    } else {
      return res.send(err);
    }
  });
};

exports.playersByPos = function(req, res) {
  return Player.find().sort('stringnum').exec( function (err, pls) {
    if (!err) {
      var players = {};
      for (var i = 0; i < pls.length; i++) {
        var p = pls[i].trupos;
        if (players.hasOwnProperty(p)) {
          players[p].push(pls[i]);
        } else {
          players[p] = [];
          players[p].push(pls[i]);
        }
      }
      return res.json(players);
    } else {
      return res.send(err);
    }
  });
};

exports.recruits = function(req, res) {
  return Recruit.find({class: req.params.year}, function (err, recs) {
    if (!err) {
      return res.json(recs);
    } else {
      return res.send(err);
    }
  });
};