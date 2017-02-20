/**
 * Created by harry on 16/11/23.
 */
(function () {
    'use strict';

    angular.module('app.components.deleteBtn')
        .controller('deleteConfirmCtrl', function($scope) {

            $scope.ok = function() {
                if ($scope.userId) {
                    $scope.yesDelete($scope.itemId, $scope.userId);
                }
                else { // default
                    $scope.yesDelete($scope.itemId);
                }
            }

        });
})();
