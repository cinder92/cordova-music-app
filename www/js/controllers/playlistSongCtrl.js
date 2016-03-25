(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('playlistSongCtrl', playlistSongCtrl);

	playlistSongCtrl.$inject = ['$scope','$rootScope','$localForage','$stateParams']

	function playlistSongCtrl($scope,$rootScope,$localForage,$stateParams) {
		//content
		var vm = this,
		plsid = $stateParams.pid

		
		$scope.$on("$ionicView.enter",function(){
			vm.list = []
			$localForage.getItem('playlistSongs').then(function(psongs){
				//encontrar las canciones de esta playlist
				//console.log(psongs.length)
				for(var i = 0; i < psongs.length; i++){
					if(psongs[i].pid == parseInt(plsid)){
						vm.list.push(psongs[i])
					}
				}
				//vm.list.push(_.find(psongs,{'pid' : parseInt(plsid)}))
				//console.log(_.find(psongs,{'pid' : plsid}))
			})

			if(vm.list.length == 0){
				console.log('No hay canciones aún')
			}
		})

		vm.play = function(id,position){
			var args = {
				plsid : plsid,
				id : id,
				position : position
			}
			//console.log(args)
			$rootScope.$emit('fromPlaylist',args)
		}
		//get songs lists from selected playlist
	}
})();