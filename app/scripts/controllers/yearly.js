'use strict';

angular.module('audbApp')
  .controller('YearlyCtrl', function ($scope, $http) {
    $scope.year = 2013;
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $http.get('/api/year/'+$scope.year).success(function(data) {
      $scope.games = data;
    });
  });
