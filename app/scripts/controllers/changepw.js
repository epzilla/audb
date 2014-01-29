'use strict';

angular.module('audbApp')
  .controller('ChangepwCtrl', function ($scope, $window, Auth) {
    $scope.user = {};
    $scope.errors = {};
    $scope.pwChanged = false;

    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }

    Auth.currentUser().$promise.then( function(user) {
      $scope.user = user;
    });

    $scope.showLoader = function() {
      var el = angular.element('.loading');
      if (el.length === 0) {
        angular.element('#map-canvas').before('<div class="loading"></div>');
      }
    };

    $scope.hideLoader = function() {
      var el = angular.element('.loading');
      if (el.length > 0) {
        el.remove();
      }
    };

    $scope.changepw = function (form) {
      $scope.showLoader();
      $scope.submitted = true;
      console.log($scope.user._id);
      console.log($scope.user.oldPassword);
      console.log($scope.user.newPassword);
      if(form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
        .then( function() {
          $scope.hideLoader();
          $scope.pwChanged = true;
          $window.setTimeout( function() {
            angular.element('#changePwModal').modal('hide');
          }, 3000);
        })
        .catch( function(err) {
          $scope.hideLoader();
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };
  });
