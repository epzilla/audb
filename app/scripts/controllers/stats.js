'use strict';

angular.module('audbApp')
  .controller('StatsCtrl', function ($scope, $http) {
    $scope.years = [];
    $scope.reverseYears = [];
    $scope.endYear = new Date().getFullYear();
    $scope.startYear = 1892;
    for (var i = $scope.startYear; i <= $scope.endYear; i++) {
      $scope.years.push(i);
    }
    for (i = $scope.endYear; i >= $scope.startYear; i--) {
      $scope.reverseYears.push(i);
    }
    $http.get('/api/conferences').success(function(confs) {
      $scope.conferences = confs;
      console.log(confs);
    });
  });
