'use strict';

angular.module('audbApp')
  .controller('YearlyCtrl', function ($scope, $http) {
    $scope.year = 2014;
    $scope.years = [];
    for (var i = $scope.year; i >= 1892; i--) {
      $scope.years.push(i);
    }
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.setYear = function(yr) {
      $http.get('/api/year/'+yr).success(function(data) {
        $scope.games = data;
      });
    };
    $scope.setYear($scope.year);
  });
