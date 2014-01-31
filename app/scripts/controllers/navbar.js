'use strict';

angular.module('audbApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $http, $window, $location, Auth, keyboardManager) {
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

    $scope.unbindAll = function() {
      keyboardManager.unbind('k');
      keyboardManager.unbind('g');
      keyboardManager.unbind('up');
      keyboardManager.unbind('down');
      keyboardManager.unbind('b');
      keyboardManager.unbind('a');
    };

    var infowindow;
    var breakpoint = 820;
    var code = '';
    $rootScope.gameDay = false;
    $rootScope.todaysGame = {};
    $rootScope.legitCheckin = 0;
    $rootScope.isCheckedIn = false;
    $scope.geo = {};
    $scope.google = $window.google;
    $scope.isSmallScreen = $window.innerWidth < breakpoint ? true : false;

    var tdpics = [
      'images/tdpics/1.jpg',
      'images/tdpics/2.jpg',
      'images/tdpics/3.jpg',
      'images/tdpics/4.jpg',
      'images/tdpics/5.jpg',
      'images/tdpics/6.jpg',
    ];

    var getRandomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var secretCount = getRandomInt(0,(tdpics.length - 1));

    var leftHandler = function() {
      if (code === 'uudd') {
        code = 'uuddl';
      } else if (code === 'uuddlr') {
        code = 'uuddlrl';
      } else {
        code = '';
      }
    };

    var rightHandler = function() {
      if (code === 'uuddl') {
        code = 'uuddlr';
      } else if (code === 'uuddlrl') {
        code = 'uuddlrlr';
      } else {
        code = '';
      }
    };

    var downHandler = function() {
      if (code === 'uu') {
        code = 'uud';
      } else if (code === 'uud') {
        code = 'uudd';
      } else {
        code = '';
      }
    };

    var aHandler = function() {
      if (code === 'uuddlrlrb') {
        touchdownAuburn();
      }
      code = '';
    };

    var bHandler = function() {
      if (code === 'uuddlrlr') {
        code = 'uuddlrlrb';
      } else {
        code = '';
      }
    };

    var touchdownAuburn = function() {
      var num = secretCount % (tdpics.length);
      angular.element('.modal-td-pic').attr({'src':tdpics[num]});
      secretCount++;
      $window.document.getElementById('td-au').play();
      console.log('TOUCHDOOOOOOWN AUBUUUUURN!!!');
      angular.element('#td-au-modal').modal('show');
    };

    if ('geolocation' in $window.navigator) {
      $scope.geo = $window.navigator.geolocation;
    }
    
    angular.element($window).resize(function () {
      $scope.setSmallScreen();
    });

    angular.element('.loader').css({
      'height': $window.innerHeight
    });

    angular.element('.modal-td-pic').css({
      'max-height': ($window.innerHeight - 250)
    });

    $scope.unbindAll();

    keyboardManager.bind('k', function() {
      $scope.keyboardModal();
    });

    keyboardManager.bind('g', function() {
      keyboardManager.bind('h', function() {
        $location.path('/');
      });
      keyboardManager.bind('s', function() {
        $location.path('/stats');
      });
      keyboardManager.bind('y', function() {
        $location.path('/yearly');
      });
      keyboardManager.bind('d', function() {
        $location.path('/depth');
      });
      keyboardManager.bind('r', function() {
        $location.path('/recruits');
      });
      $window.setTimeout( function() {
        keyboardManager.unbind('h');
        keyboardManager.unbind('s');
        keyboardManager.unbind('y');
        keyboardManager.unbind('d');
        keyboardManager.unbind('r');
      }, 1000);
    });

    keyboardManager.bind('up', function() {
      if (code === '') {
        code = 'u';
      } else if (code === 'u') {
        code = 'uu';
        keyboardManager.unbind('left');
        keyboardManager.unbind('right');
        keyboardManager.bind('left', leftHandler);
        keyboardManager.bind('right', rightHandler);
      }
    });

    keyboardManager.bind('down', downHandler);
    keyboardManager.bind('b', bHandler);
    keyboardManager.bind('a', aHandler);

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

    $scope.keyboardModal = function() {
      angular.element('#keyboardModal').modal('toggle');
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

    $scope.hideMenu = function() {
      angular.element('.navbar-toggle').click();
      angular.element('.loader').removeClass('hidden').addClass('show');
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
  });
