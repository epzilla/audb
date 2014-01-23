'use strict';

angular.module('audbApp')
  .controller('RecruitsCtrl', function ($scope, $http, localStorageService) {
    var ls = localStorageService;
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.getRecruits = function(year) {
      $scope.currentClass = year;
      $scope.recruits = ls.get('rec-'+year);
      if (!$scope.recruits) {
        $http.get('/api/recruits/'+$scope.currentClass).success(function(data) {
          $scope.recruits = data;
          ls.add('rec-'+year, data);
        });
      }
    };
    $scope.predicate = '+surname';
    $scope.getRecruits(2014);
  });
