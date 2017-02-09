(function() {

    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController($scope) {

        var vm = this;
		$scope.detailFrame = 'http://223.93.176.119:8880/rosten-medical/web/switchChats';
    }

})();
