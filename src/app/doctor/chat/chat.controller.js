(function() {

    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController($scope, $rootScope, CONFIG) {

        var vm = this;
		$scope.detailFrame = CONFIG.peerPageUrl + '/rosten-medical/web/switchChats' + '?doctor=' + $rootScope.login._id;
    }

})();
