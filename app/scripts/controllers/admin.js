'use strict';

angular.module('audbApp')
  .controller('AdminCtrl', function ($scope, $location, $http, Auth, Admin) {

    var loadData = function() {
      $http.get('/api/playersByPos').success(function (data) {
        if (!$scope.players || $scope.players !== data) {
          $scope.players = data;
        }
      });
    };

    loadData();

    $scope.enrollRecruits = function () {
      Admin.enrollRecruits().then(function (data) {
        console.log(data);
        $location.path('/depth');
      });
    };

    $scope.$on('posChange', function (event, data) {
      $http.post('/api/posChange', data).success(function (retData) {
        console.log(retData);
        loadData();
      });
    });

    $scope.authorized = Auth.isAdmin();
  });