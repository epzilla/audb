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
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  
  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // User defined
  app.get('/api/year/:season', api.year);
  app.get('/api/playersByPos', api.playersByPos);
  app.get('/api/recruits/:year', api.recruits);
  app.post('/api/updateAttendance/:gameId', api.updateAttendance);
  app.get('/api/gamesByUser/:userId', api.gamesByUser);
  app.get('/api/conferences', api.conferences);
  app.get('/api/opponents', api.opponents);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};