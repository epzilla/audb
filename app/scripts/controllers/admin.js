'use strict';

angular.module('audbApp')
  .controller('AdminCtrl', function ($q, $scope, $location, $http, Auth, Admin) {

    $scope.loadData = function() {
      $http.get('/api/players').success(function (data) {
        $scope.players = data;
        $scope.playersByPos = _.groupBy(_.sortBy(data, 'stringnum'), 'trupos');
        $scope.rosterGridOptions.data = data;
      });
    };

    $scope.gameGridOptions = {
      columnDefs: [
        { name: 'Opponent', enableCellEdit: true },
        { name: 'Date', enableCellEdit: true },
        { name: 'Location', enableCellEdit: true },
        { name: 'auscore', enableCellEdit: true},
        { name: 'opscore', enableCellEdit: true}
      ]
    };

    $scope.gameGridOptions.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      $scope.gameGridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity) {
        $scope.saveGame(rowEntity);
      });
    };

    var mapIdsAndVals = function (thing) {
      return {
        id: thing,
        value: thing
      };
    };

    var stateList = ['AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID', 'IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY', 'OH','OK','OR','PA','PR','PW','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY'];
    var stateDropdownOptions = stateList.map(mapIdsAndVals);

    var posList = ['QB', 'RB', 'FB', 'WR', 'TE', 'OL', 'DE', 'DT', 'LB', 'S', 'CB', 'K', 'P'];
    var posDropdownOptions = posList.map(mapIdsAndVals);

    var truposList = ['QB', 'RB', 'FB', 'WR2', 'WR9', 'Slot', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'WDE', 'DT', 'NG', 'SDE', 'WLB', 'MLB', 'SLB', 'SS', 'FS', 'LCB', 'RCB', 'K', 'P'];
    var truposDropdownOptions = truposList.map(mapIdsAndVals);

    var yearsList = ['FR', 'RFR', 'SO', 'JR', 'SR'];
    var yearDropdownOptions = yearsList.map(mapIdsAndVals);

    $scope.recruitsGridOptions = {
      columnDefs: [
        { name: 'forename', displayName: 'First', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'surname', displayName: 'Last', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'city', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'state', enableCellEdit: true, enableCellEditOnFocus: true, editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownOptionsArray: stateDropdownOptions},
        { name: 'hs', displayName: 'HS', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'pos', enableCellEdit: true, enableCellEditOnFocus: true, editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownOptionsArray: posDropdownOptions},
        { name: 'rivalsrank', displayName: 'R Rank', enableCellEdit: true, enableCellEditOnFocus: true, type: 'number'},
        { name: 'rivalsstars', displayName: 'R *', enableCellEdit: true, enableCellEditOnFocus: true, type: 'number'},
        { name: 'scoutrank', displayName: 'S Rank', enableCellEdit: true, enableCellEditOnFocus: true, type: 'number'},
        { name: 'scoutstars', displayName: 'S *', enableCellEdit: true, enableCellEditOnFocus: true, type: 'number'},
        { name: 'earlyEnrollee', displayName: 'Early?', enableCellEdit: true, enableCellEditOnFocus: true, type: 'boolean'}
      ]
    };

    $scope.recruitsGridOptions.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      $scope.recruitsGridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue && !_.isEqual(newValue, oldValue)) {
          $scope.saveRecruit(rowEntity);
        }
      });
    };

    $scope.rosterGridOptions = {
      columnDefs: [
        { name: 'num', enableCellEdit: true, enableCellEditOnFocus: true, type: 'number'},
        { name: 'forename', displayName: 'First', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'surname', displayName: 'Last', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'pos', enableCellEdit: true, enableCellEditOnFocus: true, editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownOptionsArray: posDropdownOptions},
        { name: 'trupos', enableCellEdit: true, enableCellEditOnFocus: true, editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownOptionsArray: truposDropdownOptions},
        { name: 'height', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'weight', enableCellEdit: true, enableCellEditOnFocus: true, type: 'number'},
        { name: 'year', enableCellEdit: true, enableCellEditOnFocus: true, editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownOptionsArray: yearDropdownOptions},
        { name: 'city', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'state', enableCellEdit: true, enableCellEditOnFocus: true, editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownOptionsArray: stateDropdownOptions},
        { name: 'hs', displayName: 'HS', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'retstart', displayName: 'Ret. Start.?', enableCellEdit: true, enableCellEditOnFocus: true, type: 'boolean'},
        { name: 'stringnum', displayName: 'String', enableCellEdit: true, enableCellEditOnFocus: true, type: 'number'},
        { name: 'img', enableCellEdit: true, enableCellEditOnFocus: true},
        { name: 'active', enableCellEdit: true, enableCellEditOnFocus: true, type: 'boolean'}
      ]
    };

    $scope.rosterGridOptions.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      $scope.rosterGridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue && !_.isEqual(newValue, oldValue)) {
          $scope.savePlayer(rowEntity);
        }
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
        game.BCS = conf.bcs ? 'y' : 'n';
        game.FBS = conf.fbs ? 'y' : 'n';
        game.SEC = (conf.conference === 'SEC East' || conf.conference === 'SEC West') ? 'y' : 'n';
        if (game.SEC) {
          game.currentConf = game.Conference = conf.conference.split(' ').join('');
        }
      } else {
        game.currentConf = game.Conference = 'FCS';
        game.BCS = 'n';
        game.FBS = 'n';
        game.SEC = 'n';
      }

      if (!game.gameid) {
        if (!$scope.maxGameNum) {
          $scope.maxGameNum = _.max(_.map(_.flatMap($scope.gamesByYear, function (g) {
            return g.games;
          }), 'gameid'));
        }

        if ($scope.maxGameNum) {
          game.gameid = ++$scope.maxGameNum;
        }
      }

      $http.post('/api/games', game).success(function (res) {
        console.info(res);
      });
    };

    $scope.saveRecruit = function (rec) {
      rec.avgstars = _.mean([rec.rivalsstars, rec.scoutstars]);
      rec.avgrank = _.mean([rec.rivalsrank, rec.scoutrank]);
      console.info(rec);
      $http.post('/api/recruits', rec).success(function (res) {
        var gridData = _.cloneDeep($scope.recruitsGridOptions.data);
        $scope.recruitsGridOptions.data = _.map(gridData, function (r) {
          return r._id ? r : res;
        });
      });
    };

    $scope.savePlayer = function (pl) {
      var player = _.cloneDeep(pl);
      delete player.$$hashKey;
      $http.post('/api/player/' + pl._id, player).success(function () {
        var savedPlayer = _.find($scope.players, {_id: player._id});
        if (savedPlayer) {
          savedPlayer = player;
          if (!savedPlayer.active) {
            _.remove($scope.players, {_id: savedPlayer._id});
          }
          $scope.playersByPos = _.groupBy(_.sortBy($scope.players, 'stringnum'), 'trupos');
        }
      });
    };

    $scope.scheduleYear = new Date().getFullYear();
    $scope.recruitsYear = $scope.scheduleYear + 1;

    $scope.scheduleYears = [$scope.scheduleYear];
    for (var i = 1; i < 5; i++) {
      $scope.scheduleYears.push($scope.scheduleYear + i);
    }

    $scope.recruitsYears = $scope.scheduleYears;
    for (var j = 3; j > 0; j--) {
      $scope.recruitsYears.push($scope.scheduleYear - j);
    }
    $scope.recruitsYears.sort();

    var gameProms = $scope.scheduleYears.map(function (yr) {
      return $http.get('/api/year/' + yr);
    });

    $q.all(gameProms).then(function (res) {
      $scope.gamesByYear = res.map(function (results, i) {
        var games = results.data || [];
        games.sort(function (a, b) { return new Date(a.Date).getTime() - new Date(b.Date).getTime(); });
        return {
          year: $scope.scheduleYears[i],
          games: games
        };
      });
      console.info($scope.gamesByYear);
      $scope.gameGridOptions.data = _.find($scope.gamesByYear, { year: $scope.scheduleYear }).games;
    });

    var recProms = $scope.recruitsYears.map(function (yr) {
      return $http.get('/api/recruits/' + yr);
    });

    $q.all(recProms).then(function (res) {
      $scope.recruitsByYear = res.map(function (results, i) {
        var recruits = results.data || [];
        _.sortBy(recruits, ['surname', 'forename']);
        return {
          class: $scope.scheduleYears[i],
          recruits: recruits
        };
      });
      console.info($scope.recruitsByYear);
      $scope.recruitsGridOptions.data = _.find($scope.recruitsByYear, { class: $scope.recruitsYear }).recruits;
    });

    $http.get('/api/conferences').success(function (data) {
      $scope.conferences = data;
    });

    $scope.setScheduleYear = function (yr) {
      $scope.scheduleYear = parseInt(yr);
      $scope.gameGridOptions.data = _.find($scope.gamesByYear, { year: $scope.scheduleYear }).games;
    };

    $scope.setRecruitsYear = function (yr) {
      $scope.recruitsYear = parseInt(yr);
      $scope.recruitsGridOptions.data = _.find($scope.recruitsByYear, { class: $scope.recruitsYear }).recruits;
    };

    $scope.addGame = function () {
      var lastGame = _.last($scope.gameGridOptions.data);
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
        Game: $scope.gameGridOptions.data.length + 1,
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
          newGame.gameid = ++$scope.maxGameNum;
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
      $scope.gameGridOptions.data.push(newGame);
    };

    $scope.addRecruit = function () {
      var newRecruit = {
        avgrank: 50,
        avgstars: 4,
        city: 'Auburn',
        class: $scope.recruitsYear,
        earlyEnrollee: false,
        forename: 'John',
        hs: 'Auburn',
        lat: 0,
        long: 0,
        pos: 'QB',
        rivalsrank: 50,
        rivalsstars: 4,
        scoutrank: 50,
        scoutstars: 4,
        state: 'AL',
        surname: 'Doe'
      };

      $scope.recruitsGridOptions.data.push(newRecruit);
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