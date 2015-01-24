'use strict';

angular.module('audbApp')
  .service('TouchDetect', function TouchDetect($window) {
    return {
      hasTouch: function () {
        return 'ontouchstart' in $window || 'onmsgesturechange' in $window;
      }
    };
  });
