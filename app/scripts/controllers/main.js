'use strict';

angular.module('audbApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, Auth, localStorageService) {
    var ls = localStorageService;
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
    $scope.user = {};
    $scope.scoreChartWidth = 1000;

    $scope.getUserGames = function () {
      $http.get('/api/gamesByUser/' + $scope.user._id).success(function(data) {
        if (!$scope.games || (angular.toJson($scope.games) !== angular.toJson(data))) {
          $scope.games = data;
          ls.add($scope.user._id + '_games', data);
          $scope.record = {
            w: 0,
            l: 0,
            t: 0,
            secW: 0,
            secL: 0,
            secT: 0,
            total: 0
          };
          for (var i = 0; i < data.length; i++) {
            $scope.record.total++;
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

    $scope.getConcatName = function (n) {
      return n.replace(/\s+/g, '').replace(/&/g, '').replace(/\./g, '');
    };

    if (Auth.isLoggedIn()) {
      Auth.currentUser().$promise.then(function(user){
        if (user._id) {
          $scope.user = user;
          $scope.record = {
            w: 0,
            l: 0,
            t: 0,
            secW: 0,
            secL: 0,
            secT: 0,
            total: 0
          };
          $scope.games = ls.get($scope.user._id + '_games');
          if ($scope.games) {
            for (var i = 0; i < $scope.games.length; i++) {
              $scope.record.total++;
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
            }
            if (angular.element('.loader').hasClass('show')) {
              angular.element('.loader').toggleClass('show');
            }
            $scope.getUserGames();
          } else {
            $scope.getUserGames();
          }

          var gameFilter = crossfilter($scope.games);

          // Dimensions
          $scope.winLossDimension = gameFilter.dimension(function (d) { 
            if (d.Result === 'W') {
              return 'Win';
            } else if (d.Result === 'L') {
              return 'Loss';
            } else {
              return 'Tie';
            }
          });
          $scope.homeAwayDimension = gameFilter.dimension(function (d) { 
            if (d.Location === 'Auburn, AL') {
              return 'Home';
            } else {
              return 'Away';
            }
          });
          $scope.confDimension = gameFilter.dimension(function (d) {
            if (d.Conference === 'Pac-10') {
              return 'Pac-12';
            } else if (d.Conference === 'Conference-USA') {
              return 'Conf-USA';
            } else if (d.Conference === 'SECWest') {
              return 'SEC (West)';
            } else if (d.Conference === 'SECEast') {
              return 'SEC (East)';
            } else {
              return d.Conference; 
            }
          });
          $scope.auScoreDimension = gameFilter.dimension(function(d) { return d.auscore; });

          $scope.winLossGroup = $scope.winLossDimension.group();
          $scope.homeAwayGroup = $scope.homeAwayDimension.group();
          $scope.confGroup = $scope.confDimension.group();
          $scope.scoreDimensionGroup = $scope.auScoreDimension.group().reduce(
              //add
            function(p,v){
              ++p.count;
              p.ausum += v.auscore;
              p.opsum += v.opscore;
              p.Auburn = p.ausum / p.count;
              p.Opponent = p.opsum / p.count;
              return p;
            },
            //remove
            function(p,v){
              ++p.count;
              p.ausum -= v.auscore;
              p.opsum -= v.opscore;
              p.Auburn = p.ausum / p.count;
              p.Opponent = p.opsum / p.count;
              return p;
            },
            //init
            function(){
              return  {Auburn: 0, Opponent: 0}; 
            });

        } else {
          $http.get('/api/userByEmail/' + $rootScope.currentUser.email).success( function (data) {
            $scope.user = data;
            $scope.getUserGames();
          });
        }
      });
    } else if (angular.element('.loader').hasClass('show')) {
      angular.element('.loader').toggleClass('show');
    }
  });
