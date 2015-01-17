'use strict';

angular.module('audbApp')
  .controller('StatsCtrl', function ($scope, $rootScope, $http, $window, Auth, keyboardManager) {
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.years = [];
    $scope.reverseYears = [];
    $rootScope.selectedTeams = [];
    $scope.endYear = new Date().getFullYear();
    $scope.startYear = 1892;
    $scope.user = {};
    $scope.record = {};
    $scope.noData = false;
    $scope.maxModalBodyHeight = $window.document.documentElement.clientHeight - 180;
    var breakpoint = 768;
    $scope.isSmallScreen = $window.document.documentElement.clientWidth < breakpoint ? true : false;

    $scope.unbindAll = function() {
      keyboardManager.unbind('s');
      keyboardManager.unbind('shift+enter');
      keyboardManager.unbind('r');
      keyboardManager.unbind('space');
    };

    $scope.focusSelect = function() {
      angular.element('.select2-search-field input').focus();
    };

    Auth.currentUser().$promise.then( function(user) {
      $scope.user = user;
    });

    for (var i = $scope.startYear; i <= $scope.endYear; i++) {
      $scope.years.push(i);
    }
    for (i = $scope.endYear; i >= $scope.startYear; i--) {
      $scope.reverseYears.push(i);
    }

    $scope.unbindAll();

    keyboardManager.bind('s', function() {
      $scope.focusSelect();
    });

    keyboardManager.bind('shift+enter', function() {
      $scope.submitForm();
    });

    keyboardManager.bind('r', function() {
      $scope.reset();
    });

    keyboardManager.bind('space', function(e) {
      var btn = e.target.getElementsByClassName('attend-td')[0].children[0];
      angular.element(btn).click();
    }, {
      'inputDisabled': false,
      'target': $window.document.getElementById('yearly-table')
    });

    $http.get('/api/conferences').success( function (confs) {
      $scope.conferences = confs;
      if ($scope.isSmallScreen) {
        angular.element('#teamSelectModal .modal-body').css({
          'max-height': $scope.maxModalBodyHeight
        });
      }
      if (angular.element('.loader').hasClass('show')) {
        angular.element('.loader').toggleClass('show');
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
      $scope.changeButtonState('loading');
      var confs = [];
      var curr = [];
      var teams = [];
      var x, y;
      for (var i = 0; i < $rootScope.selectedTeams.length; i++) {
        if ($rootScope.selectedTeams[i] === 'ALL-OPP') {
          teams.push('ALL-OPP');
          confs = [];
          break;
        } else {
          x = $rootScope.selectedTeams[i].indexOf('Conf: ');
          y = $rootScope.selectedTeams[i].indexOf('Current ');
          if (x !== -1) {
            confs.push($rootScope.selectedTeams[i].replace('Conf: ', ''));
          } else if (y !== -1) {
            curr.push($rootScope.selectedTeams[i].replace('Current ', ''));
          } else {
            teams.push($rootScope.selectedTeams[i]);
          }
        }
      }
      $http.post('/api/statsByOpponent', {
        startYear: $scope.startYear,
        endYear: $scope.endYear,
        teams: teams,
        confs: confs,
        curr: curr
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
        $scope.noData = data.length === 0 ? true : false;
        angular.element('#reset').show();
        angular.element('#stat-form').slideUp(650);
        $scope.changeButtonState('waitingForReset');
      });
    };

    $scope.reset = function () {
      $scope.changeButtonState('normal');
      angular.element('#reset').hide();
      angular.element('#stat-form').slideDown(300);
      $scope.games = [];
      $scope.record = {};
      $scope.noData = false;
      $rootScope.selectedTeams = [];
      if (!$scope.isSmallScreen) {
        angular.element('#opp-picker').select2('data', null);
        $scope.focusSelect();
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
        return games.some(function(thisGame) {
          return thisGame === gameID;
        });
      }
      return false;
    };

    $scope.getConcatName = function (n) {
      return n.replace(/\s+/g, '').replace(/&/g, '').replace(/\./g, '');
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

    $scope.changeButtonState = function(state) {
      switch (state) {
        case 'loading':
          angular.element('#stat-form .submit-btn button').prop('disabled', true)
                                              .html('Working...');
          break;
        case 'waitingForReset':
          angular.element('#stat-form .submit-btn button').prop('disabled', true)
                                              .html('Do it <span class="glyphicon glyphicon-circle-arrow-right top-3px"></span>');
          break;
        default:
          angular.element('#stat-form .submit-btn button').prop('disabled', false)
                                              .html('Do it <span class="glyphicon glyphicon-circle-arrow-right top-3px"></span>');
      }
    };
  });
