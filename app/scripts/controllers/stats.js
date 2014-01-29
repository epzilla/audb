'use strict';

angular.module('audbApp')
  .controller('StatsCtrl', function ($scope, $rootScope, $http, $window, Auth) {
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.years = [];
    $scope.reverseYears = [];
    $rootScope.selectedTeams = [];
    $scope.endYear = (new Date().getFullYear()) - 1;
    $scope.startYear = 1892;
    $scope.user = {};
    $scope.record = {};
    $scope.maxModalBodyHeight = $window.document.documentElement.clientHeight - 180;
    var breakpoint = 768;
    $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;

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
      if ($scope.isSmallScreen) {
        angular.element('#teamSelectModal .modal-body').css({
          'max-height': $scope.maxModalBodyHeight
        });
      }
    });

    $scope.showSelectTeams = function() {
      angular.element('#teamSelectModal').modal('show');
    };

    $scope.smallScreenSelectTeam = function (team) {
      var i = $rootScope.selectedTeams.indexOf(team);
      if (i === -1) {
        $rootScope.selectedTeams.push(team);
      } else {
        $rootScope.selectedTeams.splice(i, 1);
      }
    };

    $scope.submitForm = function () {
      angular.element('#stat-form button').prop('disabled', true);
      var confs = [];
      var teams = [];
      var x;
      for (var i = 0; i < $rootScope.selectedTeams.length; i++) {
        if ($rootScope.selectedTeams[i] === 'ALL-OPP') {
          teams.push('ALL-OPP');
          confs = [];
          break;
        } else {
          x = $rootScope.selectedTeams[i].indexOf('Conf: ');
          if (x !== -1) {
            confs.push($rootScope.selectedTeams[i].replace('Conf: ', ''));
          } else {
            teams.push($rootScope.selectedTeams[i]);
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
      $scope.record = {};
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

    $scope.alert = function (msg) {
      $window.alert(msg);
    };

    $scope.setSelectedTeams = function(a) {
      $rootScope.selectedTeams = a;
    };

    $scope.setStart = function(a) {
      $scope.startYear = a;
    };

    $scope.setEnd = function(a) {
      $scope.endYear = a;
    };
  });
