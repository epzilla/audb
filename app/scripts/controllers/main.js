'use strict';

angular.module('audbApp')
  .controller('MainCtrl', function () {
    if (angular.element('#nav-menu-collapse').hasClass('in')) {
      angular.element('.navbar-toggle').click();
    }
  });
