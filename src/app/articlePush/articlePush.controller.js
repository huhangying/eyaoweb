(function() {

    'use strict';

    angular
        .module('app.home')
        .controller('ArticlePushController', ArticlePushController);

    /** @ngInject */
    function ArticlePushController($scope, $http, toastr, $uibModal) {

        var vm = this;
		$scope.test = 'teddst';
		vm.selectSendees = function () {
			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/articlePush/partials/selectSendees.html',
				size: 'lg',
				resolve: {
					// test: '='
				}
			});

		};



    }

})();
