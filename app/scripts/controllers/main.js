'use strict';

angular.module('audbApp')
  .controller('MainCtrl', function ($scope, $http, Auth, localStorageService) {
    var ls = localStorageService;
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.user = {};

    Auth.currentUser().$promise.then(function(user){
      if (user._id) {
        $scope.user = user;
        $scope.record = {
          w: 0,
          l: 0,
          t: 0,
          secW: 0,
          secL: 0,
          secT: 0,
          total: 0
        };
        $scope.games = ls.get('myGames');
        if ($scope.games) {
          for (var i = 0; i < $scope.games.length; i++) {
            $scope.record.total++;
            switch($scope.games[i].Result) {
              case 'W':
                $scope.record.w++;
                if ($scope.games[i].SEC === 'y') {
                  $scope.record.secW++;
                }
                break;
              case 'L':
                $scope.record.l++;
                if ($scope.games[i].SEC === 'y') {
                  $scope.record.secL++;
                }
                break;
              default:
                $scope.record.t++;
                if ($scope.games[i].SEC === 'y') {
                  $scope.record.secT++;
                }
            }
          }
        } else {
          $http.get('/api/gamesByUser/' + $scope.user._id).success(function(data) {
            $scope.games = data;
            ls.add('myGames', data);
            for (var i = 0; i < data.length; i++) {
              $scope.record.total++;
              switch(data[i].Result) {
                case 'W':
                  $scope.record.w++;
                  if (data[i].SEC === 'y') {
                    $scope.record.secW++;
                  }
                  break;
                case 'L':
                  $scope.record.l++;
                  if (data[i].SEC === 'y') {
                    $scope.record.secL++;
                  }
                  break;
                default:
                  $scope.record.t++;
                  if (data[i].SEC === 'y') {
                    $scope.record.secT++;
                  }
              }
            }
          });
        }
      }
    });
  });
