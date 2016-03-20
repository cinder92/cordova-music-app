(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('songListCtrl', songListCtrl);

	songListCtrl.$inject = ['$cordovaFile','searchFiles','$localForage'];

	function songListCtrl($cordovaFile,searchFiles,$localForage) {
		//content
		var vm = this
		vm.list
		searchFiles.searchInDirectorys().then(function(songList){
	      	vm.list = songList
	      	//guardar en la base de datos la información de las canciones
	      	$localForage.setItem('songList',songList);
	      
	    },function(error){
	      alert(error)
	    })
		
	}
})();