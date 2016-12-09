(function() {

    'use strict';

    angular
        .module('app.home')
        .controller('ArticlePushController', ArticlePushController);

    /** @ngInject */
    function ArticlePushController($scope) {

        var vm = this;
		$scope.dynamicTooltip = 'ddsds';

    }

})();
