(function() {

    'use strict';

    angular
        .module('app.shortcut')
        .controller('ShortcutController', ShortcutController);

    /** @ngInject */
    function ShortcutController($scope, $rootScope, CONFIG) {

        var vm = this;
		$scope.detailFrame = CONFIG.peerPageUrl + '/rosten-medical/doctor/personalInformation' + '?doctor=' + $rootScope.login._id;
    }

})();
