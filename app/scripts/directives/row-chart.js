'use strict';

angular.module('audbApp').directive('rowChart', function($window) {
  return {
    restrict: 'E',
    scope: {
      dimension: '=',
      dimensionGroup: '=',
      chartWidth: '=',
      chartScale: '=',
      colors: '='
    },
    link: function(scope, element) {
      // var el = element[0];
      // var width = el.clientWidth;
      // var height = el.clientHeight;

      var drawChart = function() {
        var rowChart = dc.rowChart(element[0]);
      
        rowChart
          .width(scope.chartWidth)
          .height(250)
          .margins({top: 20, left: 10, right: 10, bottom: 20})
          .dimension(scope.dimension)
          .group(scope.dimensionGroup)
          .renderLabel(true)
          // assign colors to each value in the x scale domain
          .colors(scope.colors)
          .colorDomain([0,100])
          .label(function (d) {
            return d.key;
          })
          .keyAccessor(function (d) {
            return d.key;
          })
          .valueAccessor(function (d) {
            return d.value.toFixed();
          })
          .colorAccessor(function (d) {
            return d.value.toFixed();
          })
          .title(function (d) {
            return d.value.toFixed() + '%';
          })
          .x(scope.chartScale)
          .xAxis().scale(scope.chartScale)
          .tickValues([0,25,50,75,100])
          .tickFormat(function (d) {
            return d + '%';
          });

        dc.renderAll();
      };

      if (scope.dimensionGroup) {
        drawChart();
      }

      scope.$watch('dimensionGroup', function() {
        if (scope.dimensionGroup) {
          drawChart();
        }
      });

      scope.$watch( function() {
        return $window.innerWidth;
      }, function() {
        if (scope.dimensionGroup) {
          drawChart();
        }
      });
    }
  };
});