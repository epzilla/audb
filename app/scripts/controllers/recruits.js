'use strict';

angular.module('audbApp')
  .controller('RecruitsCtrl', function ($scope, $http, $window, localStorageService, keyboardManager, TouchDetect) {
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }

    var ls = localStorageService;
    var breakpoint = 768;
    var dateNow = new Date();
    $scope.hasTouch = TouchDetect.hasTouch();
    $scope.thisYear = dateNow.getFullYear();
    $scope.currentClass = dateNow.getMonth() < 2 ? $scope.thisYear : ($scope.thisYear + 1);
    $scope.recClasses = [];
    for (var i = 2011; i <= $scope.thisYear + 1; i++) {
      $scope.recClasses.push(i);
    }

    $scope.unbindAll = function () {
      keyboardManager.unbind('left');
      keyboardManager.unbind('right');
      keyboardManager.unbind('n');
      keyboardManager.unbind('p');
      keyboardManager.unbind('h');
      keyboardManager.unbind('shift+h');
      keyboardManager.unbind('r');
      keyboardManager.unbind('s');
      keyboardManager.unbind('shift+r');
      keyboardManager.unbind('shift+s');
    };

    $scope.nextYear = function () {
      if ($scope.currentClass < $scope.recClasses[$scope.recClasses.length - 1]) {
        $scope.currentClass++;
        $scope.getRecruits($scope.currentClass);
      }
    };

    $scope.prevYear = function () {
      if ($scope.currentClass > $scope.recClasses[0]) {
        $scope.currentClass--;
        $scope.getRecruits($scope.currentClass);
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

    $scope.getRecruits = function (year) {
      $scope.currentClass = parseInt(year);
      $scope.recruits = ls.get('rec-'+year);
      $scope.getRecruitsFromDb(year);
    };

    $scope.getRecruitsFromDb = function (year) {
      $http.get('/api/recruits/'+$scope.currentClass).success(function (data) {
        if (!$scope.recruits || (angular.toJson($scope.recruits) !== angular.toJson(data))) {
          $scope.recruits = data;
          ls.add('rec-'+year, data);
        }
        if (angular.element('.loader').hasClass('show')) {
          angular.element('.loader').toggleClass('show');
        }
      });
    };

    $scope.sortAlpha = function () {
      $scope.predicate = '[surname, forename]';
      $scope.reverse = !$scope.reverse;
    };

    $scope.sortPos = function () {
      $scope.predicate = 'pos';
      $scope.reverse = !$scope.reverse;
    };

    $scope.sortHome = function () {
      $scope.predicate = '[state, city, hs, surname, forename]';
      $scope.reverse = !$scope.reverse;
    };

    $scope.sortHS = function () {
      $scope.predicate = '[hs, state, city, hs, surname, forename]';
      $scope.reverse = !$scope.reverse;
    };

    $scope.sortRStars = function () {
      $scope.predicate = 'rivalsstars';
      $scope.reverse = !$scope.reverse;
    };

    $scope.sortSStars = function () {
      $scope.predicate = 'scoutstars';
      $scope.reverse = !$scope.reverse;
    };

    $scope.sortRRank = function () {
      $scope.predicate = 'rivalsrank';
      $scope.reverse = !$scope.reverse;
    };

    $scope.sortSRank = function () {
      $scope.predicate = 'scoutrank';
      $scope.reverse = !$scope.reverse;
    };

    $scope.unbindAll();

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

    keyboardManager.bind('n', function () {
      $scope.sortAlpha();
    });

    keyboardManager.bind('p', function () {
      $scope.sortPos();
    });

    keyboardManager.bind('h', function () {
      $scope.sortHome();
    });

    keyboardManager.bind('shift+h', function () {
      $scope.sortHS();
    });

    keyboardManager.bind('r', function () {
      $scope.sortRStars();
    });

    keyboardManager.bind('s', function () {
      $scope.sortSStars();
    });

    keyboardManager.bind('shift+r', function () {
      $scope.sortRRank();
    });

    keyboardManager.bind('shift+s', function () {
      $scope.sortSRank();
    });

    $scope.predicate = 'surname';
    $scope.reverse = false;
    $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;
    $scope.getRecruits($scope.currentClass);
  });
