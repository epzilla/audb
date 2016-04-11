'use strict';

angular.module('audbApp')
  .factory('Admin', function ($http) {
    return {
      enrollRecruits: function (early) {
        var url = '/api/recruits/enroll';
        if (early) {
          url += '?early=true';
        }

        return $http.post(url).then(function (data) {
          return data;
        }).catch(function (error) {
          console.log(error);
          throw new Error(error);
        });
      },

      advancePlayers: function () {
        return $http.post('/api/advancePlayers').then(function (data) {
          return data;
        }).catch(function (error) {
          console.log(error);
          throw new Error(error);
        });
      }
    };
  });
