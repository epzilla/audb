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
    $scope.geo = {};
    $scope.google = $window.google;
    $rootScope.legitCheckin = 0;
    var infowindow;
    if ('geolocation' in $window.navigator) {
      $scope.geo = $window.navigator.geolocation;
    }
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.checkIn = function() {
      $http.get('/api/checkinInfo').success( function (data) {
        if (data !== null && data !== 'null') {
          $rootScope.gameDay = true;
        }
        if ($rootScope.gameDay) {
          $rootScope.todaysGame = data;
          $scope.geo.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var mapOptions = {
              center: new $scope.google.maps.LatLng(lat, lon),
              zoom: 8
            };
            $scope.map = new $scope.google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+
              lat+','+lon+'&sensor=false').success( function (data) {
              if (data.results) {
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
                  $rootScope.legitCheckin = 2;
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
          $rootScope.legitCheckin = 1;
        }
      });
      angular.element('#checkinModal').modal('show');
    };
  });
