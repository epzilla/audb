'use strict';

angular.module('audbApp')
  .controller('DepthCtrl', function ($scope, $http) {
    $scope.year = 2014;
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $http.get('/api/playersByPos').success(function(data) {
      $scope.players = data;
    });
  });
