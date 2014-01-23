'use strict';

angular.module('audbApp')
  .controller('MainCtrl', function ($scope, $http, Auth, localStorageService) {
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.user = {};

    Auth.currentUser().$promise.then(function(user){
      if (user._id) {
        $scope.user = user;
        $http.get('/api/gamesByUser/' + $scope.user._id).success(function(data) {
          $scope.games = data;
          $scope.record = {
            w: 0,
            l: 0,
            t: 0,
            secW: 0,
            secL: 0,
            secT: 0,
            total: 0
          };
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
    });
    $scope.localStuff = {};
    $scope.testLocalStorage = function () {
      var someJSON = {
        hair: 'blonde',
        age: 28,
        city: 'Akron'
      };
      localStorageService.add('localStorageKey',someJSON);
      $scope.localStuff = localStorageService.get('localStorageKey');
      console.log($scope.localStuff);
    };

  });
