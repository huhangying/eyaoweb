(function() {

    'use strict';

    angular
        .module('app.articlePush')
        .controller('ArticlePushController', ArticlePushController);

    /** @ngInject */
    function ArticlePushController($scope, $http, toastr, $uibModal) {

        var vm = this;
		vm.selectSendees = function () {
			var instance = $uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/articlePush/partials/selectSendees.html',
				controller: 'SelectSendeesController',
				size: 'lg',
				resolve: {
					//selectOk: '='
				}
			});


		};

		vm.selectTemplate = function () {
			var instance = $uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/articlePush/partials/selectTemplate.html',
				controller: 'SelectTemplateController',
				size: 'lg',
				resolve: {
					//selectOk: '='
				}
			});
		};

    }

})();
