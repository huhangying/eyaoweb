(function () {
	'use strict';

	angular.module('app.components')
		.controller('MsgReplyCtrl', MsgReplyCtrl);

	/** @ngInject */
	function MsgReplyCtrl($scope, $rootScope, $http, toastr, CONFIG) {

		$scope.sendReply = function() {
			//validation first
			if (!$scope.reply.name) {
				toastr.warning('标题是必选项');
				return;
			}

			var reqBody = {
				type: $scope.object.type,
				doctor: $scope.replyMsg.doctor,
				user: $scope.replyMsg.user._id,
				name: $scope.reply.name,
				//notes: $scope.reply.notes,
				status: 2
			};

			$http.post(CONFIG.baseApiUrl + 'feedback', reqBody)
				.then(function (response) {
						// check if return null
						if (response.data && response.data.return && response.data.return == 'null'){
							toastr.error(CONFIG.Error.FailedOnCreate);
						}
						else {
							$scope.markAsRead();
							// close
							$scope.$close();
						}

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});
		};

		$scope.markAsRead = function() {
			$http.patch(CONFIG.baseApiUrl + 'feedback/' + $scope.replyMsg._id, {status: 1}) // mark as read
				.then(function (response) {
						// check if return null
						if (response.data && response.data.return && response.data.return == 'null'){
							toastr.error(CONFIG.Error.FailedOnUpdate);
						}
						else {
							// close
							$scope.$close();
						}

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});
		};

		$scope.reply = {
			name: '回复: ' + $scope.replyMsg.name
		};

		$scope.attachedImg = undefined;
		var init = function() {
			if ($scope.replyMsg.notes) {
				$scope.attachedImg = CONFIG.peerBaseUrl + $scope.replyMsg.notes;
			}
		};
		init();

	}
})();
