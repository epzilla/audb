'use strict';

angular.module('audbApp')
  .controller('StatsCtrl', function ($scope, $http, $window, Auth) {
    $scope.years = [];
    $scope.reverseYears = [];
    $scope.selectedTeams = [];
    $scope.endYear = new Date().getFullYear();
    $scope.startYear = 1892;
    $scope.user = {};
    $scope.record = {};
    var breakpoint = 768;

    Auth.currentUser().$promise.then( function(user) {
      $scope.user = user;
    });

    for (var i = $scope.startYear; i <= $scope.endYear; i++) {
      $scope.years.push(i);
    }
    for (i = $scope.endYear; i >= $scope.startYear; i--) {
      $scope.reverseYears.push(i);
    }

    $http.get('/api/conferences').success( function (confs) {
      $scope.conferences = confs;
    });

    $scope.submitForm = function () {
      angular.element('#stat-form button').prop('disabled', true);
      var confs = [];
      var teams = [];
      var x;
      for (var i = 0; i < $scope.selectedTeams.length; i++) {
        if ($scope.selectedTeams[i] === 'ALL-OPP') {
          teams.push('ALL-OPP');
          confs = [];
          break;
        } else {
          x = $scope.selectedTeams[i].indexOf('Conf: ');
          if (x !== -1) {
            confs.push($scope.selectedTeams[i].replace('Conf: ', ''));
          } else {
            teams.push($scope.selectedTeams[i]);
          }
        }
      }
      $http.post('/api/statsByOpponent', {
        startYear: $scope.startYear,
        endYear: $scope.endYear,
        teams: teams,
        confs: confs
      }).success( function (data) {
        $scope.games = data;
        $scope.record = {
          w: 0,
          l: 0,
          t: 0,
          secW: 0,
          secL: 0,
          secT: 0
        };
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
        angular.element('#reset').show();
        angular.element('#stat-form').slideUp(650);

      });
    };

    $scope.reset = function () {
      angular.element('#stat-form button').prop('disabled', false);
      angular.element('#reset').hide();
      angular.element('#stat-form').slideDown(300);
      $scope.games = [];
      $scope.selectedTeams = [];
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
      for (var i = 0; i < games.length; i++) {
        if (games[i] === gameID) {
          return true;
        }
      }
      return false;
    };

    $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;
  });
