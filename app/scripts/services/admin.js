'use strict';

angular.module('audbApp')
  .factory('Admin', function ($http) {
    return {
      enrollRecruits: function () {
        $http.post('/api/recruits/enroll').then(function (data) {
          return data;
        }).catch(function (error) {
          console.log(error);
          throw new Error(error);
        });
      }
    };
  });
