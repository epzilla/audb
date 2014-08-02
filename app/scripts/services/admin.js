'use strict';

angular.module('audbApp')
  .factory('Admin', function ($http) {
    var adminService = {};
    adminService.enrollRecruits = function() {
      $http.post('/api/recruits/enroll').success(function(data) {
        return data;
      }).error(function(error) {
        console.log(error);
        throw new Error(error);
      });
    };
    return adminService;
  });
