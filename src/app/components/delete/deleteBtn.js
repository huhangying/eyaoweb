/**
 * Created by harry on 16/11/23.
 */
(function () {
    'use strict';

    angular.module('app.components.deleteBtn', [])

        .directive('deleteBtn', function() {
            return {
                restrict: 'AE',
                transclude: true,
                scope: {
                    yesDelete: '=',
                    itemId: '=',
                    userId: '=?'
                    //removeCat: '&'

                },
                controller: ['$scope', '$uibModal', function($scope, $uibModal)  {
                    //var panes = $scope.panes = [];

                    $scope.open = function() {

                        $uibModal.open({
                            animation: true,
                            templateUrl: 'app/components/delete/deleteConfirm.html',
                            controller: 'deleteConfirmCtrl',
                            size: 'sm',
                            scope: $scope
                            // resolve: {
                            //     item: function () {
                            //         return item;
                            //     }
                            // }
                        });
                    }

                }],
                template: '<button class="btn btn-danger btn-xs" ng-click="open()"><i class="fa fa-trash" aria-hidden="true"></i></button>'
            };
        });
})();
