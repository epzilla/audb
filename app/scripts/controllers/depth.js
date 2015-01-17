'use strict';

angular.module('audbApp')
  .controller('DepthCtrl', function ($scope, $http, localStorageService) {
    var ls = localStorageService;
    $scope.year = new Date().getFullYear();
    $scope.selectedPlayer = {};
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.players = ls.get('depthChart');
    $http.get('/api/playersByPos').success(function(data) {
      if (!$scope.players || $scope.players !== data) {
        $scope.players = data;
        ls.add('depthChart', data);
      }
      if (angular.element('.loader').hasClass('show')) {
        angular.element('.loader').toggleClass('show');
      }
    });
    if (angular.element('.loader').hasClass('show') && $scope.players) {
      angular.element('.loader').toggleClass('show');
    }
    $scope.showPlayerInfo = function(pl) {
      $scope.selectedPlayer = pl;
      angular.element('#playerModal').modal('show');
    };
  });
