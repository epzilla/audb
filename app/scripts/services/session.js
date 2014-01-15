'use strict';

angular.module('audbApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
