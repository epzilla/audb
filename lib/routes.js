'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    games = require('./controllers/games');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function (app) {

  // Server API Routes
  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // User defined
  app.get('/api/year/:season', api.year);
  app.get('/api/playersByPos', api.playersByPos);
  app.post('/api/player/:id', api.updatePlayer);
  app.get('/api/recruits/:year', api.recruits);
  app.get('/api/recruits/:year/early', api.earlyEnrollees);
  app.post('/api/updateAttendance/:gameId', api.updateAttendance);
  app.post('/api/checkIn/:gameId', api.checkIn);
  app.get('/api/gamesByUser/:userId', api.gamesByUser);
  app.get('/api/conferences', api.conferences);
  app.get('/api/opponents', api.opponents);
  app.post('/api/statsByOpponent', api.statsByOpponent);
  app.get('/api/userByEmail/:email', api.userByEmail);
  app.get('/api/checkinInfo', api.checkinInfo);
  app.post('/api/recruits/enroll', api.enrollRecruits);
  app.post('/api/posChange', api.posChange);
  app.post('/api/advancePlayers', api.advancePlayers);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
