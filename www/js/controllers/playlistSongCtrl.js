(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('playlistSongCtrl', playlistSongCtrl);

	playlistSongCtrl.$inject = ['$rootScope','$localForage','$stateParams'];

	function playlistSongCtrl($rootScope,$localForage,$stateParams) {
		//content
		var vm = this,
		plsid = $stateParams.pid
		console.log(plsid)
		vm.list

		$localForage.getItem('playlist').then(function(playlists){
			var current = _.find(playlists,{'id' : plsid}),
			songs = current.songs

			vm.list = songs;

			console.log(vm.list)
		})

		vm.play = function(position,id){
			var args = {
				plsid : plsid,
				id : id,
				position : position
			}
			$rootScope.$emit('fromPlaylist',args)
		}
		//get songs lists from selected playlist
	}
})();