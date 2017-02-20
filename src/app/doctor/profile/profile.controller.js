(function() {

    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope, $rootScope, CONFIG) {

        var vm = this;
		$scope.detailFrame = CONFIG.peerPageUrl + '/rosten-medical/doctor/personalInformation' + '?doctor=' + $rootScope.login._id;
    }

})();
