'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Game = mongoose.model('Game'),
    Player = mongoose.model('Player'),
    User = mongoose.model('User'),
    Recruit = mongoose.model('Recruit'),
    Conference = mongoose.model('Conference'),
    _ = require('lodash');

/**
 * Get all games for a given season
 */
exports.year = function (req, res) {
  return Game.find({Season: req.params.season})
    .sort({'Date':'asc'})
    .exec(function (err, games) {
    if (!err) {
      return res.json(games);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get list of players grouped by position
 */
exports.playersByPos = function (req, res) {
  return Player.find({active: true}).sort('stringnum').exec(function (err, pls) {
    if (!err) {
      return res.json(_.groupBy(pls, 'trupos'));
    } else {
      return res.send(err);
    }
  });
};

exports.updatePlayer = function (req, res) {
  return Player.update({_id: req.params.id}, req.body, function (err, updatedPlayer) {
    if (err) { return res.send(err);}
    return res.json(updatedPlayer);
  });
};

/**
 * Get all recruits for a given class
 */
exports.recruits = function (req, res) {
  return Recruit.find({class: req.params.year}, function (err, recs) {
    if (!err) {
      return res.json(recs);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Enroll recruits for the class
 */
exports.enrollRecruits = function (req, res) {
  var thisYear = new Date().getFullYear();
  Player.find().sort({'pid': 'desc'}).exec(function (err, pls) {
    if (err) return err;
    console.log('I got: ' + pls[0].pid);
    var nextPID = pls[0].pid;
    Recruit.find({class: thisYear}, function (err, recs) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      for (var i = 0; i < recs.length; i++) {
        var rec = recs[i];
        nextPID++;
        console.log(nextPID);
        var newPlayer = new Player({
          forename: rec.forename,
          surname: rec.surname,
          pos: rec.pos,
          height: '6-2',
          weight: 200,
          year: 'FR',
          city: rec.city,
          state: rec.state,
          hs: rec.hs,
          num: 0,
          retstart: 0,
          trupos: rec.pos,
          stringnum: 5,
          pid: nextPID,
          active: true
        });
        // console.dir(newPlayer);
        newPlayer.save(function (err, data) {
          if (err) {
            console.log(err);
          }
        });
      }
      return res.send(200);
    });
  });
};

/**
 *  Update attendance of specified user for game
 */
exports.updateAttendance = function (req, res, next) {
  var userId = req.user._id;
  var gameId = req.params.gameId;
  return User.findById(userId, function (err, user) {
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
      user.save(function (err, user) {
        if (err) {
          return res.send(500, err);
        } else {
          return res.json(user);
        }
      });
    } else {
      return res.send(404, 'USER_NOT_FOUND');
    }
  });
};

/**
 * Get all games a user has attended
 */
exports.gamesByUser = function (req, res, next) {
  var userId = req.params.userId;
  return User.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
    if (user) {
      Game.find().where('_id').in(user.games).exec(function (err, games) {
        if (err) return next(new Error('Failed to load Game'));
        if (games) {
          return res.json(games);
        }
      });
    }
  });
};

/**
 * Get a user by email address
 */
exports.userByEmail = function (req, res, next) {
  var em = req.params.email;
  return User.findOne({email: em}, function (err, user) {
    if (err) return next(new Error('Failed to find User'));
    return res.json(user);
  });
};

exports.opponents = function (req, res, next) {

};

/**
 * Get a list of all conferences
 */
exports.conferences = function (req, res, next) {
  return Conference.find(function (err, confs) {
    if (err) res.send(err);
    return res.json(confs);
  });
};

/**
 * Get W/L/T record against specified opponents/conferences
 * over a specified span of years
 */
exports.statsByOpponent = function (req, res, next) {
  var teams = req.body.teams;
  var confs = req.body.confs;
  var curr = req.body.curr;
  var startYear = req.body.startYear;
  var endYear = req.body.endYear;
  if (_.contains(confs, 'Pac-12')) {
    confs.push('Pac-10');
    confs.push('Pac-8');
  }
  if (_.contains(teams, 'ULL')) {
    teams.push('SW Louisiana');
  }
  if (_.contains(teams, 'ULM')) {
    teams.push('NE Louisiana');
  }
  if (_.contains(teams, 'ALL-OPP')) {
    return Game.find().where('Season').gte(startYear).lte(endYear)
      .sort({'Season': 'asc'})
      .exec(function (err, games) {
        if (err) return next(new Error('Failed to get games.'));
        if (games) {
          return res.json(games);
        }
      });
  } else if (_.contains(confs, 'SEC')) {
    return Game.find().where('Season').gte(startYear).lte(endYear)
      .or([{Opponent: { $in: teams}}, {Conference: {$in: confs}}, {currentConf: {$in: curr}}, {SEC: 'y'}])
      .sort({'Season': 'asc'})
      .exec(function (err, games) {
        if (err) res.send(err);
        return res.json(games);
      });
  } else if (_.contains(confs, 'SEC East') || _.contains(confs, 'SEC West')) {
    if (_.contains(confs, 'SEC East')) {
      _.remove(confs, function (c) { return c === 'SEC East'; });
      confs.push('SECEast');
    }
    if (_.contains(confs, 'SEC West')) {
      _.remove(confs, function (c) { return c === 'SEC West'; });
      confs.push('SECWest');
    }
    return Game.find().where('Season').gte(startYear).lte(endYear)
      .or([{Opponent: { $in: teams}}, {Conference: {$in: confs}}, {currentConf: {$in: curr}}])
      .sort({'Season': 'asc'})
      .exec(function (err, games) {
        if (err) res.send(err);
        return res.json(games);
      });
  } else {
    return Game.find().where('Season').gte(startYear).lte(endYear)
      .or([{Opponent: { $in: teams}}, {Conference: {$in: confs}}, {currentConf: {$in: curr}}])
      .sort({'Season': 'asc'})
      .exec(function (err, games) {
        if (err) res.send(err);
        return res.json(games);
      });
  }
};

/**
 * Get info on the game that's happening today
 */
exports.checkinInfo = function (req, res, next) {
  var date = new Date();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month.toString();
  }
  if (date < 10) {
    date = '0' + date.toString();
  }
  var dateString = date.getFullYear() + '-' + month + '-' + date.getDate();
  return Game.findOne({'Date': dateString}, function (err, game) {
    if (err) return next( new Error('Couldn\'t find a game.'));
    return res.json(game);
  });
};

/**
 * Check a user in to a game
 * (similar to the updateAttendance method, but only
 * lets user check in, not un-check in.)
 */
exports.checkIn = function (req, res, next) {
  var userId = req.user._id;
  var gameId = req.params.gameId;
  return User.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
    if (user) {
      var ind = user.games.indexOf(gameId);
      if (ind === -1) {
        // New, legit check-in
        user.games.push(gameId);
        user.save(function (err, user) {
          if (err) {
            return res.send(500, err);
          } else {
            return res.json(user);
          }
        });
      } else {
        // They've already checked in before
        return res.send('REPEAT');
      }
    } else {
      return res.send(404, 'USER_NOT_FOUND');
    }
  });
};

var reRank = function (trupos, cb) {
  Player.find({trupos: trupos})
    .sort({'stringnum': 1})
    .exec(function (err, players) {
      var savedPlayers = [];

      for (var i = 0; i < players.length; i++) {
        players[i].stringnum = i + 1;

        players[i].save(function (err, player) {
          if (err) {
            cb(err);
          }

          savedPlayers.push(player);
          if (i === players.length - 1 || savedPlayers.length === players.length) {
            cb(null, savedPlayers);
          }
        });
      }
    });
};

exports.posChange = function (req, res, next) {
  var toID = req.body.toData._id;
  var fromID = req.body.fromData._id;
  var posChange = req.body.posChange;
  var playerIDs = [toID];
  playerIDs.push(fromID);

  Player.find({_id: {$in: playerIDs}}, function (err, players) {
    if (err) {
      res.send(500, err);
    }

    if (players && players.length === 2) {
      var fromPlayer, toPlayer, fromStringNum, toStringNum, originalPos;

      if (players[0]._id.toString() === toID.toString()) {
        toPlayer = players[0];
        fromPlayer = players[1];
      } else if (players[0]._id.toString() === fromID.toString()) {
        toPlayer = players[1];
        fromPlayer = players[0];
      }

      fromStringNum = JSON.parse(JSON.stringify(fromPlayer.stringnum));
      toStringNum = JSON.parse(JSON.stringify(toPlayer.stringnum));
      fromPlayer.stringnum = parseInt(toStringNum);
      originalPos = fromPlayer.trupos;

      if (posChange) {
        fromPlayer.trupos = toPlayer.trupos;
        toPlayer.stringnum++;
      } else {
        toPlayer.stringnum = parseInt(fromStringNum);
      }

      fromPlayer.save(function (err, fp) {
        if (err) {
          res.send(500, err);
        }

        toPlayer.save(function (err, tp) {
          if (err) {
            res.send(500, err);
          }

          reRank(toPlayer.trupos, function(err, rerankedPlayers) {
            if (err) {
              res.send(500, err);
            }

            if (posChange) {
              reRank(originalPos, function (err, reRankedPls) {
                if (err) {
                  res.send(500, err);
                }

                res.send(200);
              });
            } else {
              res.send(200);
            }
          });
        });
      });
    }
  });
};

/**
 * Get list of players grouped by position
 */
exports.advancePlayers = function (req, res) {
  return Player.find({active: true}, function (err, pls) {
    if (!err) {
      var players = _.groupBy(pls, 'year');
      var changedPlayers = [];

      var seniors = players.SR;
      players.SR.forEach(function (pl) {
        pl.active = false;
        console.log(pl.forename + ' ' + pl.surname + ' graduated');
        pl.save(function (err, savedPlayer) {
          if (err) {
            res.send(500, err);
          }
          changedPlayers.push(savedPlayer);
          if (changedPlayers.length === pls.length) {
            res.json(changedPlayers);
          }
        });
      });

      players.JR.forEach(function (pl) {
        pl.year = 'SR';
        console.log(pl.forename + ' ' + pl.surname + ' is now a Senior');
        pl.save(function (err, savedPlayer) {
          if (err) {
            res.send(500, err);
          }
          changedPlayers.push(savedPlayer);
          if (changedPlayers.length === pls.length) {
            res.json(changedPlayers);
          }
        });
      });

      players.SO.forEach(function (pl) {
        pl.year = 'JR';
        console.log(pl.forename + ' ' + pl.surname + ' is now a Junior');
        pl.save(function (err, savedPlayer) {
          if (err) {
            res.send(500, err);
          }
          changedPlayers.push(savedPlayer);
          if (changedPlayers.length === pls.length) {
            res.json(changedPlayers);
          }
        });
      });

      players.RFR.forEach(function (pl) {
        pl.year = 'SO';
        console.log(pl.forename + ' ' + pl.surname + ' is now a Sophomore');
        pl.save(function (err, savedPlayer) {
          if (err) {
            res.send(500, err);
          }
          changedPlayers.push(savedPlayer);
          if (changedPlayers.length === pls.length) {
            res.json(changedPlayers);
          }
        });
      });

      players.FR.forEach(function (pl) {
        pl.year = 'SO';
        console.log(pl.forename + ' ' + pl.surname + ' is now a Sophomore');
        pl.save(function (err, savedPlayer) {
          if (err) {
            res.send(500, err);
          }
          changedPlayers.push(savedPlayer);
          if (changedPlayers.length === pls.length) {
            res.json(changedPlayers);
          }
        });
      });

    } else {
      return res.send(err);
    }
  });
};
