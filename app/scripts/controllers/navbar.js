'use strict';

angular.module('audbApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $http, $window, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Stats',
      'link': '/stats'
    }, {
      'title': 'Yearly Results',
      'link': '/yearly'
    }, {
      'title': 'Depth Chart',
      'link': '/depth'
    }, {
      'title': 'Recruiting',
      'link': '/recruits'
    }];

    $rootScope.gameDay = false;
    $rootScope.todaysGame = {};
    $rootScope.legitCheckin = 0;
    $rootScope.isCheckedIn = false;
    $scope.geo = {};
    $scope.google = $window.google;
    var infowindow;
    var breakpoint = 820;
    $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;

    if ('geolocation' in $window.navigator) {
      $scope.geo = $window.navigator.geolocation;
    }
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };

    $scope.setSmallScreen = function () {
      $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;
      $scope.$apply();
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.changePwModal = function() {
      angular.element('#changePwModal').modal('show');
    };

    $scope.showLoader = function() {
      var el = angular.element('.loading');
      if (el.length === 0) {
        angular.element('#map-canvas').before('<div class="loading"></div>');
      }
    };

    $scope.hideLoader = function() {
      var el = angular.element('.loading');
      if (el.length > 0) {
        el.remove();
      }
    };

    $scope.checkIn = function() {
      if (!$rootScope.isCheckedIn) {
        $scope.showLoader();
        $http.get('/api/checkinInfo').success( function (data) {
          if (data !== null && data !== 'null') {
            $rootScope.gameDay = true;
          }
          if ($rootScope.gameDay) {
            // There IS a game today
            $rootScope.todaysGame = data;
            $scope.geo.getCurrentPosition(function(position) {
              var lat = position.coords.latitude;
              var lon = position.coords.longitude;
              var mapOptions = {
                center: new $scope.google.maps.LatLng(lat, lon),
                zoom: 8
              };
              $scope.map = new $scope.google.maps.Map(document.getElementById('map-canvas'), mapOptions);
              $scope.hideLoader();

              $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+
                lat+','+lon+'&sensor=false').success( function (data) {
                if (data.results) {
                  // Google maps came back with data
                  var stateMatch = false;
                  var cityMatch = false;
                  var cs = $rootScope.todaysGame.Location.split(', ');
                  var gameCity = cs[0];
                  var gameState = cs[1];
                  for (var i=0; i < data.results.length; i++) {
                    var thisResult = data.results[i].address_components;
                    if (cityMatch && stateMatch) {
                      $rootScope.legitCheckin = 2;
                      break;
                    }
                    for (var x in thisResult) {
                      if (thisResult[x].long_name === gameCity || thisResult[x].short_name === gameCity) {
                        cityMatch = true;
                      }
                      if (thisResult[x].long_name === gameState || thisResult[x].short_name === gameState) {
                        stateMatch = true;
                      }
                    }
                  }
                  if (cityMatch && stateMatch) {
                    // There is a game today, and you ARE there
                    $http.post('/api/checkIn/'+$rootScope.todaysGame._id).success( function (data) {
                      if (data === 'REPEAT') {
                        $rootScope.legitCheckin = 3;
                      } else {
                        $rootScope.legitCheckin = 2;
                        $rootScope.currentUser = data;
                      }
                      $rootScope.isCheckedIn = true;
                    });
                    var contentString;
                    if (gameCity === 'Auburn') {
                      contentString = '<h4>' + $rootScope.todaysGame.Opponent + ' at Auburn</h4>' +
                                      '<p>' + $rootScope.todaysGame.Location + '</p>';
                    } else {
                      contentString = '<h4>Auburn at ' + $rootScope.todaysGame.Opponent + '</h4>' +
                                      '<p>' + $rootScope.todaysGame.Location + '</p>';
                    }

                    infowindow = new $scope.google.maps.InfoWindow({
                      map: $scope.map,
                      position: mapOptions.center,
                      content: contentString
                    });
                  } else {
                    // There is a game today, but you're NOT there
                    $rootScope.legitCheckin = 1;
                    infowindow = new $scope.google.maps.InfoWindow({
                      map: $scope.map,
                      position: mapOptions.center,
                      content: '<h4><u>Oops!</u></h4><p>Sorry, but it doesn\'t look like you\'re at the game.</p>' +
                                '<p>We can\'t check you in at this time.</p>'
                    });
                  }
                }
              });
            });
          } else {
            // There's NOT a game today
            $scope.hideLoader();
            $rootScope.legitCheckin = 1;
          }
        });
      }
      angular.element('#checkinModal').modal('show');
    };
    angular.element($window).resize(function () {
      $scope.setSmallScreen();
    });
  });
