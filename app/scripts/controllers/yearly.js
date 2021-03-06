'use strict';

angular.module('audbApp')
  .controller('YearlyCtrl', function ($scope, $rootScope, $http, Auth,
                                      $window, localStorageService, keyboardManager, TouchDetect) {
    var ls = localStorageService;
    var breakpoint = 768;

    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }

    $scope.thisYear = new Date().getFullYear();
    $scope.year = $scope.thisYear;
    $scope.years = [];
    $scope.user = {};
    $scope.hasTouch = TouchDetect.hasTouch();

    Auth.currentUser().$promise.then(function (user) {
      $scope.user = user;
    });

    for (var i = $scope.year; i >= 1892; i--) {
      $scope.years.push(i);
    }

    $scope.unbindAll = function () {
      keyboardManager.unbind('left');
      keyboardManager.unbind('right');
      keyboardManager.unbind('space');
    };

    $scope.getGamesByYear = function (yr) {
      $http.get('/api/year/'+yr).success(function (data) {
        if (!$scope.games || (angular.toJson($scope.games) !== angular.toJson(data))) {
          $scope.resetRecord();
          $scope.games = data;
          ls.add('yr-'+yr, data);
          $scope.calculateRecord(data);
        }
        if (angular.element('.loader').hasClass('show')) {
          angular.element('.loader').toggleClass('show');
        }
      });
    };

    $scope.resetRecord = function () {
      $scope.record = {
        w: 0,
        l: 0,
        t: 0,
        secW: 0,
        secL: 0,
        secT: 0
      };
    };

    $scope.calculateRecord = function (data) {
      for (var i = 0; i < data.length; i++) {
        switch (data[i].Result) {
          case 'W':
            $scope.record.w++;
            if (data[i].SEC) {
              $scope.record.secW++;
            }
            break;
          case 'L':
            $scope.record.l++;
            if (data[i].SEC) {
              $scope.record.secL++;
            }
            break;
          default:
            $scope.record.t++;
            if (data[i].SEC) {
              $scope.record.secT++;
            }
        }
      }

      if (angular.element('.loader').hasClass('show')) {
        angular.element('.loader').toggleClass('show');
      }
    };

    $scope.setYear = function (yr) {
      if (yr <= $scope.thisYear && yr >= 1892) {
        $scope.year = parseInt(yr);
        $scope.resetRecord();
        $scope.games = ls.get('yr-'+yr);
        if ($scope.games) {
          $scope.calculateRecord($scope.games);
          if ($scope.year === $scope.thisYear) {
            $scope.getGamesByYear(yr);
          }
        } else {
          $scope.getGamesByYear(yr);
        }
      }
    };

    $scope.toggleAttended = function (gameID) {
      var game = angular.element('#' + gameID);
      if (game.hasClass('yes')) {
        game.removeClass('yes').html('<span class="glyphicon glyphicon-minus"></span>');
      } else {
        game.addClass('yes').html('<span class="glyphicon glyphicon-ok"></span>');
      }
      $http.post('/api/updateAttendance/' + gameID).success(function (user) {
        $scope.user = user;
      });
    };

    $scope.smallScreenAttend = function (gameID) {
      if ($scope.isSmallScreen) {
        angular.element('#game-row-'+gameID).toggleClass('attended');
        $http.post('/api/updateAttendance/' + gameID).success(function (user) {
          $scope.user = user;
        });
      }
    };

    $scope.didAttend = function (gameID) {
      var games = $scope.user.games;
      if (games) {
        return games.some(function (thisGame) {
          return thisGame === gameID;
        });
      }
      return false;
    };

    $scope.getConcatName = function (n) {
      return n.replace(/\s+/g, '').replace(/&/g, '').replace(/\./g, '');
    };

    $scope.nextYear = function () {
      $scope.setYear($scope.year + 1);
      if (!$scope.isSmallScreen) {
        angular.element('.select2-container .select2-choice > .select2-chosen').text($scope.year);
      }
    };

    $scope.prevYear = function () {
      $scope.setYear($scope.year - 1);
      if (!$scope.isSmallScreen) {
        angular.element('.select2-container .select2-choice > .select2-chosen').text($scope.year);
      }
    };

    $scope.swipeNextYear = function () {
      if ($scope.hasTouch) {
        $scope.nextYear();
      }
    };

    $scope.swipePrevYear = function () {
      if ($scope.hasTouch) {
        $scope.prevYear();
      }
    };

    $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;

    $scope.setYear($scope.year);

    keyboardManager.bind('left', function () {
      $scope.prevYear();
    }, {
      'inputDisabled': false
    });

    keyboardManager.bind('right', function () {
      $scope.nextYear();
    }, {
      'inputDisabled': false
    });

    keyboardManager.bind('space', function (e) {
      var btn = e.target.getElementsByClassName('attend-td')[0].children[0];
      angular.element(btn).click();
    }, {
      'inputDisabled': false,
      'target': $window.document.getElementById('yearly-table')
    });

  });
