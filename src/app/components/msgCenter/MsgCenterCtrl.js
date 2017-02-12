(function () {
	'use strict';

	angular.module('app.components')
		.controller('MsgCenterCtrl', MsgCenterCtrl);

	/** @ngInject */
	function MsgCenterCtrl($scope, $rootScope, $http, toastr, CONFIG) {

		$scope.getMessages = function() {
			$http.get(CONFIG.baseApiUrl + 'feedbacks/unread/' + $scope.object.type +'/' + $rootScope.login._id)
				.then(function (response) {
						// check if return null
						if (response.data && response.data.return && response.data.return == 'null'){
							//toastr.error(CONFIG.Error.NoData);
						}
						else {
							$scope.object.messages = response.data;
							$scope.object.messages.map( function(msg) {
								msg.time = moment(msg.updatedAt).startOf('hour').fromNow();
							});
						}

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});
		};

	}
})();
