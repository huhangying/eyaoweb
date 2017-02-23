(function() {

    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController($scope, $rootScope, CONFIG, $state) {

        var vm = this;
		var chatroomidParam = '';
		if ($state.params.chatroom) {
			chatroomidParam = '&roomid=' + $state.params.chatroom;
		}
		$scope.detailFrame = CONFIG.peerPageUrl + 'web/switchChats?doctor=' + $rootScope.login._id + chatroomidParam;
    }

})();
