'use strict';

angular.module('audbApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTouch',
  'LocalStorageModule',
  'ui.select2'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, localStorageServiceProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/stats', {
        templateUrl: 'partials/stats',
        controller: 'StatsCtrl'
      })
      .when('/yearly', {
        templateUrl: 'partials/yearly',
        controller: 'YearlyCtrl'
      })
      .when('/depth', {
        templateUrl: 'partials/depth',
        controller: 'DepthCtrl'
      })
      .when('/recruits', {
        templateUrl: 'partials/recruits',
        controller: 'RecruitsCtrl'
      })
      .when('/admin', {
        templateUrl: 'partials/admin',
        controller: 'AdminCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and 403s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);

    localStorageServiceProvider.setPrefix('audb');

  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });