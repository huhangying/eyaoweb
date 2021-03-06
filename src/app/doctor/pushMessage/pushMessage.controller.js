(function() {

    'use strict';

    angular
        .module('app.pushMessage')
        .controller('PushMessageController', PushMessageController);

    /** @ngInject */
    function PushMessageController($scope, $rootScope, CONFIG) {

        var vm = this;
		$scope.detailFrame = CONFIG.peerPageUrl + 'doctor/pushMessage?doctor=' + $rootScope.login._id;
    }

})();
