'use strict';

angular.module('audbApp')
  .controller('AdminCtrl', function ($scope, $location, $http, Auth, Admin) {

    $scope.loadData = function() {
      $http.get('/api/playersByPos').success(function (data) {
        $scope.players = data;
      });
    };

    $scope.loadData();

    $scope.enrollRecruits = function (early) {
      Admin.enrollRecruits(early).then(function (data) {
        console.log(data);
        $location.path('/depth');
      });
    };

    $scope.advancePlayers = function () {
      Admin.advancePlayers().then(function (data) {
        console.log(data);
        $location.path('/depth');
      });
    };

    $scope.$on('posChange', function (event, data) {
      $http.post('/api/posChange', data).success(function () {
        $scope.loadData();
      });
    });

    $scope.authorized = Auth.isAdmin();
  });