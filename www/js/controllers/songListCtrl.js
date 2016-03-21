(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('songListCtrl', songListCtrl);

	songListCtrl.$inject = ['$rootScope','$scope','$ionicModal','$cordovaFile','searchFiles','$localForage'];

	function songListCtrl($rootScope,$scope,$ionicModal,$cordovaFile,searchFiles,$localForage) {
		//content
		var vm = this
		vm.list = ''
		vm.songList = ''

		$rootScope.globalSearch = function(){
			$rootScope.showSearch = true
		}

		searchFiles.searchInDirectorys().then(function(songList){
	      	vm.list = songList
	      	//guardar en la base de datos la información de las canciones
	      	$localForage.setItem('songList',songList);
	      
	    },function(error){
	      alert(error)
	    })

		var viewModal = ''
        $ionicModal.fromTemplateUrl('templates/nowPlaying.html', {
	     scope: $scope,
	     animation: 'slide-in-up'
	    }).then(function(modal) {
	      viewModal = modal;
	    });

	    $rootScope.showPlayNow = function(id,position){
	    	$rootScope.showSearch = false
	    	vm.songList = ''
	    	viewModal.show()
	    	if(undefined != id && undefined != position){
	    		//tocar canción
		    	var args = {
		    		id : id,
		    		position : position
		    	}
		    	$rootScope.$emit('playSong', args);
	    	}
	    }

	    vm.closePlayNow = function(){
	    	viewModal.hide()
	    }

	    //disparar evento cuando se cierre el teclado
	    window.addEventListener('native.keyboardhide', function(){
	    	$rootScope.showSearch = false
	    });

		
	}
})();