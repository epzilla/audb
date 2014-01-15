'use strict';

angular.module('audbApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
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
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
