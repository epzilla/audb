'use strict';

angular.module('audbApp')
  .controller('AdminCtrl', function ($q, $scope, $location, $http, Auth, Admin) {

    $scope.loadData = function() {
      $http.get('/api/playersByPos').success(function (data) {
        $scope.players = data;
      });
    };

    $scope.gridOptions = {
      columnDefs: [
        { name: 'Opponent', enableCellEdit: true },
        { name: 'Date', enableCellEdit: true },
        { name: 'Location', enableCellEdit: true },
        { name: 'auscore', enableCellEdit: true},
        { name: 'opscore', enableCellEdit: true}
      ]
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity) {
        $scope.saveGame(rowEntity);
      });
    };

    $scope.saveGame = function (game) {
      if (game.auscore > game.opscore) {
        game.Result = 'W';
      } else if (game.auscore < game.opscore) {
        game.Result = 'L';
      } else {
        game.Result = 'T';
      }

      var conf = _.find($scope.conferences, function (c) {
        return _.some(c.members, function (m) {
          return m.toLowerCase() === game.Opponent.toLowerCase();
        });
      });

      if (conf) {
        game.currentConf = game.Conference = conf.conference;
        game.BCS = conf.bcs;
        game.FBS = conf.fbs;
        game.SEC = conf.conference === 'SEC East' || conf.conference === 'SEC West';
        if (game.SEC) {
          game.currentConf = game.Conference = conf.conference.split(' ').join('');
        }
      } else {
        game.currentConf = game.Conference = 'FCS';
        game.BCS = false;
        game.FBS = false;
        game.SEC = false;
      }

      if (!game.gameid) {
        if (!$scope.maxGameNum) {
          $scope.maxGameNum = _.max(_.map(_.flatMap($scope.gamesByYear, function (g) {
            return g.games;
          }), 'gameid'));
        }

        if ($scope.maxGameNum) {
          game.gameid = $scope.maxGameNum++;
        }
      }

      $http.post('/api/games', game).success(function (res) {
        console.info(res);
      });
    };

    $scope.scheduleYear = new Date().getFullYear();
    $scope.years = [$scope.scheduleYear];
    for (var i = 1; i < 5; i++) {
      $scope.years.push($scope.scheduleYear + i);
    }

    var proms = $scope.years.map(function (yr) {
      return $http.get('/api/year/' + yr);
    });

    $q.all(proms).then(function (res) {
      $scope.gamesByYear = res.map(function (results, i) {
        var games = results.data || [];
        games.sort(function (a, b) { return new Date(a.Date).getTime() - new Date(b.Date).getTime(); });
        return {
          year: $scope.years[i],
          games: games
        };
      });
      console.info($scope.gamesByYear);
      $scope.gridOptions.data = _.find($scope.gamesByYear, { year: $scope.scheduleYear }).games;
    });

    $http.get('/api/conferences').success(function (data) {
      $scope.conferences = data;
    });

    $scope.setScheduleYear = function (yr) {
      $scope.scheduleYear = parseInt(yr);
      $scope.gridOptions.data = _.find($scope.gamesByYear, { year: $scope.scheduleYear }).games;
    };

    $scope.addGame = function () {
      var lastGame = _.last($scope.gridOptions.data);
      var newGame = {
        Opponent: 'Opp',
        auscore: 0,
        opscore: 0,
        Season: $scope.scheduleYear,
        Date: $scope.scheduleYear + '-09-01',
        Location: 'Auburn, AL',
        Conference: 'SECWest',
        BCS: 'y',
        SEC: 'y',
        Game: $scope.gridOptions.data.length + 1,
        Result: 'T',
        currentConf: 'SECWest'
      };

      if (lastGame && lastGame.gameid) {
        newGame.gameid = lastGame.gameid + 1;
        $scope.maxGameNum = newGame.gameid;
      } else {
        if (!$scope.maxGameNum) {
          $scope.maxGameNum = _.max(_.map(_.flatMap($scope.gamesByYear, function (g) {
            return g.games;
          }), 'gameid'));
        }

        if ($scope.maxGameNum) {
          newGame.gameid = $scope.maxGameNum++;
        }
      }

      if (lastGame) {
        var lastDate = new Date(lastGame.Date);
        newGame.Game = lastGame.Game + 1;
        lastDate.setDate(lastDate.getDate() + 8);
        var mo = lastDate.getMonth() + 1;
        var d = lastDate.getDate();
        mo = mo.toString().length > 1 ? mo : '0' + mo;
        d = d.toString().length > 1 ? d : '0' + d;
        newGame.Date = lastDate.getFullYear() + '-' + mo + '-' + d;
      }
      console.info(newGame.gameid);
      $scope.gridOptions.data.push(newGame);
    };

    $scope.loadData();

    $scope.enrollRecruits = function (early) {
      Admin.enrollRecruits(early).then(function (data) {
        console.log(data);
        $location.path('/depth');
      });
    };

    $scope.advancePlayers = function () {
      Admin.advancePlayers().then(function (data) {
        console.log(data);
        $location.path('/depth');
      });
    };

    $scope.$on('posChange', function (event, data) {
      $http.post('/api/posChange', data).success(function () {
        $scope.loadData();
      });
    });

    $scope.authorized = Auth.isAdmin();
  });