(function () {
	'use strict';

	angular.module('app.components')
		.controller('MsgCenterCtrl', MsgCenterCtrl);

	/** @ngInject */
	function MsgCenterCtrl($scope, $rootScope, $http, $uibModal, toastr, CONFIG) {
		moment.defineLocale('zh-cn', {abbr:'zh-cn'});
		$scope.getMessages = function() {
			if ($scope.object.messages && $scope.object.messages.length === $scope.object.count) {
				return;
			}

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

		$scope.replyMessage = function(msg) {

			$scope.replyMsg = msg;
			$scope.replyTitle = $scope.object.title;
			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/components/msgCenter/msgReply.html',
				controller: 'MsgReplyCtrl',
				size: 'lg'
			})
				.result.then(
				function () {

				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

	}
})();
