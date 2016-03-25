(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('favouritesCtrl', favouritesCtrl);

	favouritesCtrl.$inject = ['$scope','$localForage','$rootScope','favoriteSongs'];

	function favouritesCtrl($scope,$localForage,$rootScope,favoriteSongs) {
		//content
		var vm = this
		vm.list = ''
		vm.songList = ''

		$scope.$on("$ionicView.beforeEnter",function(){
			favoriteSongs.getFavoritSongs().then(function(songs){
				vm.list = songs
			},function(fail){
				console.log('Fallo porque => '+fail)
			})
		})
		
		$rootScope.globalSearch = function(){
			$rootScope.showSearch = true
		}

		//disparar evento cuando se cierre el teclado
	    window.addEventListener('native.keyboardhide', function(){
	    	$rootScope.showSearch = false
	    });
	}
})();