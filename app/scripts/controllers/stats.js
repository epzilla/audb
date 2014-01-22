'use strict';

angular.module('audbApp')
  .controller('StatsCtrl', function ($scope, $http) {
    $scope.years = [];
    $scope.reverseYears = [];
    $scope.selectedTeams = [];
    $scope.endYear = new Date().getFullYear();
    $scope.startYear = 1892;
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
        console.log(data);
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
  });
