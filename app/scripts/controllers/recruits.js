'use strict';

angular.module('audbApp')
  .controller('RecruitsCtrl', function ($scope, $http, $window, localStorageService) {
    var ls = localStorageService;
    var breakpoint = 768;
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.getRecruits = function(year) {
      $scope.currentClass = parseInt(year);
      $scope.recruits = ls.get('rec-'+year);
      $scope.getRecruitsFromDb(year);
    };

    $scope.getRecruitsFromDb = function(year) {
      $http.get('/api/recruits/'+$scope.currentClass).success(function(data) {
        if (!$scope.recruits || (angular.toJson($scope.recruits) !== angular.toJson(data))) {
          $scope.recruits = data;
          ls.add('rec-'+year, data);
        }
        if (angular.element('.loader').hasClass('show')) {
          angular.element('.loader').toggleClass('show');
        }
      });
    };

    $scope.predicate = '+surname';
    $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;
    $scope.getRecruits(2014);
  });
