/**
 * Created by harry on 17/4/9.
 */
(function() {

	'use strict';

	angular
		.module('rin')
		.service('utilService', utilService);

	/** @ngInject */
	function utilService()  {

		this.getRandomUniqueId = function(charCount) {
			var charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
			var charSetSize = 36;
			var id = '';
			for (var i = 1; i <= charCount; i++) {
				var randPos = Math.floor(Math.random() * charSetSize);
				id += charSet[randPos];
			}
			return id;
		};

	}

})();
