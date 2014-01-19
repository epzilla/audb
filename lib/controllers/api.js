'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Game = mongoose.model('Game'),
    Player = mongoose.model('Player'),
    User = mongoose.model('User'),
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

/**
 *  Update attendance of specified user for game
 */
exports.updateAttendance = function (req, res, next) {
  var userId = req.user._id;
  var gameId = req.params.gameId;
  console.log('UserId: ' + userId);
  console.log('gameId: ' + gameId);
  User.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
    if (user) {
      var ind = user.games.indexOf(gameId);
      if (ind === -1) {
        // Add it
        user.games.push(gameId);
      } else {
        // Remove it
        user.games.splice(ind, 1);
      }
      // Save
      user.save(function(err) {
        if (err) {
          res.send(500, err);
        } else {
          res.send(user);
        }
      });
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};