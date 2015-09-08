'use strict';

angular.module('audbApp').directive('draggon', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      element.children().attr('draggable', true);

      element.on('dragstart', function () {
        event.dataTransfer.setData('text/plain', JSON.stringify(element.data('player-info')));
      });

      element.on('drop', function (e) {
        var fromData = JSON.parse(event.dataTransfer.getData('text/plain'));
        var dropTarget = e.target;

        if (element.hasClass('dragover-highlight')) {
          element.removeClass('dragover-highlight');
        }

        if (dropTarget.nodeName === 'A') {
          dropTarget = e.target.parentElement;
          if (dropTarget.nodeName === 'STRONG') {
            dropTarget = dropTarget.parentElement;
          }
        } else if (dropTarget.nodeName === 'DIV') {
          dropTarget = e.target.children[0];
        }

        var toData = JSON.parse(dropTarget.dataset.playerInfo);
        var posChange = fromData.trupos !== toData.trupos;
        $rootScope.$broadcast('posChange', {
          fromData: fromData,
          toData: toData,
          posChange: posChange
        });

        e.preventDefault();
      });

      element.on('dragover', function (e) {
        element.addClass('dragover-highlight');
        e.preventDefault();
      });

      element.on('dragleave', function (e) {
        if (element.hasClass('dragover-highlight')) {
          element.removeClass('dragover-highlight');
        }
        e.preventDefault();
      });

      element.on('dragend', function (e) {
        if (element.hasClass('dragover-highlight')) {
          element.removeClass('dragover-highlight');
        }
        e.preventDefault();
      });
    }
  };
});
