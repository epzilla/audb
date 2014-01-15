'use strict';

angular.module('audbApp')
  .controller('RecruitsCtrl', function ($scope, $http) {
    $scope.currentClass = 2014;
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $http.get('/api/recruits/'+$scope.currentClass).success(function(data) {
      $scope.recruits = data;
    });
  });
