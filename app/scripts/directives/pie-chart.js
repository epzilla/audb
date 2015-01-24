'use strict';

angular.module('audbApp').directive('pieChart', function () {
  return {
    restrict: 'E',
    scope: {
      dimension: '=',
      dimensionGroup: '=',
      chartHeight: '='
    },
    link: function (scope, element) {
      var drawChart = function () {
        var pieChart = dc.pieChart(element[0]);
        var pieSize = (3/4) * scope.chartHeight;

        pieChart
          .height(scope.chartHeight) // (optional) define chart height, :default = 200
          .width(scope.chartHeight) // (optional) define chart width, :default = 200
          .radius(pieSize/2 - (pieSize * 0.2)) // define pie radius
          .innerRadius(pieSize/2 - (pieSize * 0.4))
          .legend(dc.legend().x(pieSize).y((scope.chartHeight - pieSize)/2).itemHeight(13).gap(5))
          .dimension(scope.dimension) // set dimension
          .group(scope.dimensionGroup) // set group
          .valueAccessor(function (d) {
            return d.value;
          });

        dc.renderAll();
      };

      if (scope.dimensionGroup) {
        drawChart();
      }

      scope.$watch('dimensionGroup', function () {
        if (scope.dimensionGroup) {
          drawChart();
        }
      });
    }
  };
});