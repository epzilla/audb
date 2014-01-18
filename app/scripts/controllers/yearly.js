'use strict';

angular.module('audbApp')
  .controller('YearlyCtrl', function ($scope, $http) {
    $scope.thisYear = new Date().getFullYear();
    $scope.year = $scope.thisYear;
    $scope.years = [];
    for (var i = $scope.year; i >= 1892; i--) {
      $scope.years.push(i);
    }
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.setYear = function(yr) {
      $http.get('/api/year/'+yr).success(function(data) {
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
      });
    };
    $scope.toggleAttended = function(gameID) {
      var game = angular.element('#' + gameID);
      if (game.hasClass('yes')) {
        game.removeClass('yes').html('<span class="glyphicon glyphicon-minus"></span>');
        //TODO Unmark attendance
      } else {
        game.addClass('yes').html('<span class="glyphicon glyphicon-ok"></span>');
      }
    };
    $scope.setYear($scope.year);
  });
