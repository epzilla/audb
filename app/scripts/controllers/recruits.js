'use strict';

angular.module('audbApp')
  .controller('RecruitsCtrl', function ($scope, $http) {
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.getRecruits = function(year) {
      $scope.currentClass = year;
      $http.get('/api/recruits/'+$scope.currentClass).success(function(data) {
        $scope.recruits = data;
      });
    };
    $scope.predicate = '+surname';
    $scope.getRecruits(2014);
  });
