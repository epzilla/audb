'use strict';

angular.module('audbApp')
  .factory('Auth', function Auth($timeout, $location, $rootScope, Session, User, $cookieStore) {

    // Get currentUser from cookie
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');
    var loginCallbacks = [];
    var logoutCallbacks = [];

    return {

      /**
       * Authenticate user
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function (user, callback) {
        var cb = callback || angular.noop;

        return Session.save({
          email: user.email,
          password: user.password,
          _id: user._id
        }, function (user) {
          $rootScope.currentUser = user;
          $timeout(function () {
            loginCallbacks.forEach(function (callb) {
              callb();
            });
          }, 10);
          return cb();
        }, function (err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Unauthenticate user
       *
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      logout: function (callback) {
        var cb = callback || angular.noop;

        return Session.delete(function () {
          $rootScope.currentUser = null;
          $timeout(function () {
            logoutCallbacks.forEach(function (callb) {
              callb();
            });
          }, 10);
          return cb();
        },
        function (err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function (user, callback) {
        var cb = callback || angular.noop;

        return User.save(user, function (user) {
          $rootScope.currentUser = user;
          return cb(user);
        },
        function (err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function (oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.update({
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function (user) {
          return cb(user);
        }, function (err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      currentUser: function () {
        return User.get();
      },

      /**
       * Simple check to see if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function () {
        return $rootScope.currentUser;
      },

      /**
       * Simple check to see if a user is logged in
       *
       * @return {Boolean}
       */
      isAdmin: function () {
        var user = $rootScope.currentUser;
        return (user && user.role === 'admin');
      },

      registerLoginCallback: function(cb) {
        if (loginCallbacks.indexOf(cb) === -1) {
          loginCallbacks.push(cb);
        }
      },

      registerLogoutCallback: function(cb) {
        if (logoutCallbacks.indexOf(cb) === -1) {
          logoutCallbacks.push(cb);
        }
      }
    };
  });