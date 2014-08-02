'use strict';

angular.module('audbApp')
  .controller('AdminCtrl', function ($scope, $location, Auth, Admin) {
    $scope.enrollRecruits = function() {
      Admin.enrollRecruits().then(function(data) {
        console.log(data);
        $location.path('/depth');
      });
    };

    $scope.authorized = Auth.isAdmin();
  });