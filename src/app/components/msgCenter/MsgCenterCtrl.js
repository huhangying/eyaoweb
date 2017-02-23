(function () {
	'use strict';

	angular.module('app.components')
		.controller('MsgCenterCtrl', MsgCenterCtrl);

	/** @ngInject */
	function MsgCenterCtrl($scope, $rootScope, $http, $uibModal, $state, toastr, CONFIG) {

		$scope.getMessages = function() {
			if ($scope.object.messages && $scope.object.messages.length === $scope.object.count) {
				return;
			}

			if ($scope.object.type === 0) {

				$scope.object.checkResultList.map(function(chatroom) {
					$scope.object.messages = [];

					$http.get(CONFIG.baseApiUrl + 'user/' + chatroom.user)
						.then(function (response) {
								// check if return null
								if (response.data && response.data.return && response.data.return == 'null'){
									//toastr.error(CONFIG.Error.NoData);
								}
								else {
									var usr = response.data;
									$scope.object.messages.push( {
										chatroom: chatroom._id,
										user: usr,
										name: chatroom.user_unread + '条新消息',
										time: moment(chatroom.updated).startOf('second').fromNow()
									});
								}

							},
							function(){
								toastr.error(CONFIG.Error.Internal);
							});
				});


			}
			else if ($scope.object.type > 0) {
				$http.get(CONFIG.baseApiUrl + 'feedbacks/unread/' + $scope.object.type +'/' + $rootScope.login._id)
					.then(function (response) {
							// check if return null
							if (response.data && response.data.return && response.data.return == 'null'){
								//toastr.error(CONFIG.Error.NoData);
							}
							else {
								$scope.object.messages = response.data;
								$scope.object.messages.map( function(msg) {
									msg.time = moment(msg.updatedAt).startOf('second').fromNow();
								});
							}

						},
						function(){
							toastr.error(CONFIG.Error.Internal);
						});
			}

		};

		$scope.replyMessage = function(msg, type) {

			if (type === 0) { // chat
				$state.go('app.chat', { chatroom: msg.chatroom });
				return;
			}

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
