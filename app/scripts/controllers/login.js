'use strict';

angular.module('audbApp')
  .controller('LoginCtrl', function ($scope, $rootScope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }

    $scope.login = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(function () {
          // Logged in, redirect to home
          $location.path('/');
          $rootScope.$broadcast('login');
        })
        .catch(function (err) {
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };
  });