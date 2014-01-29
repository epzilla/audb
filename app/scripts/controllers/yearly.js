'use strict';

angular.module('audbApp')
  .controller('YearlyCtrl', function ($scope, $rootScope, $http, Auth, $window, localStorageService) {
    var ls =localStorageService;
    var breakpoint = 768;
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.thisYear = new Date().getFullYear();
    $scope.year = $scope.thisYear;
    $scope.years = [];
    $scope.user = {};
    Auth.currentUser().$promise.then( function(user) {
      $scope.user = user;
    });

    for (var i = $scope.year; i >= 1892; i--) {
      $scope.years.push(i);
    }

    $scope.getGamesByYear = function (yr) {
      $http.get('/api/year/'+yr).success(function(data) {
          if (!$scope.games || (angular.toJson($scope.games) !== angular.toJson(data))) {
            $scope.games = data;
            ls.add('yr-'+yr, data);
            for (var i = 0; i < data.length; i++) {
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
          }
          if (angular.element('.loader').hasClass('show')) {
            angular.element('.loader').toggleClass('show');
          }
        });
    };

    $scope.setYear = function(yr) {
      $scope.year = parseInt(yr);
      $scope.record = {
          w: 0,
          l: 0,
          t: 0,
          secW: 0,
          secL: 0,
          secT: 0
        };
      $scope.games = ls.get('yr-'+yr);
      if ($scope.games) {
        for (var i = 0; i < $scope.games.length; i++) {
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
          if (angular.element('.loader').hasClass('show')) {
            angular.element('.loader').toggleClass('show');
          }
        }
        if ($scope.year === $scope.thisYear) {
          $scope.getGamesByYear(yr);
        }
      } else {
        $scope.getGamesByYear(yr);
      }
    };

    $scope.toggleAttended = function(gameID) {
      var game = angular.element('#' + gameID);
      if (game.hasClass('yes')) {
        game.removeClass('yes').html('<span class="glyphicon glyphicon-minus"></span>');
      } else {
        game.addClass('yes').html('<span class="glyphicon glyphicon-ok"></span>');
      }
      $http.post('/api/updateAttendance/' + gameID).success( function(user) {
        $scope.user = user;
      });
    };

    $scope.smallScreenAttend = function(gameID) {
      if ($scope.isSmallScreen) {
        angular.element('#game-row-'+gameID).toggleClass('attended');
        $http.post('/api/updateAttendance/' + gameID).success( function(user) {
          $scope.user = user;
        });
      }
    };

    $scope.didAttend = function(gameID) {
      var games = $scope.user.games;
      if (games) {
        for (var i = 0; i < games.length; i++) {
          if (games[i] === gameID) {
            return true;
          }
        }
      }
      return false;
    };

    $scope.getConcatName = function (n) {
      return n.replace(/\s+/g, '').replace(/&/g, '').replace(/\./g, '');
    };

    $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;

    $scope.setYear($scope.year);

  });
