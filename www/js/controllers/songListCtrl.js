(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('songListCtrl', songListCtrl);

	songListCtrl.$inject = ['$rootScope','$scope','$ionicModal','$cordovaFile','searchFiles','$localForage'];

	function songListCtrl($rootScope,$scope,$ionicModal,$cordovaFile,searchFiles,$localForage) {
		//content
		var vm = this
		vm.list = []
		vm.songList = ''
		vm.searchSong = ''

		$rootScope.globalSearch = function(){
			$rootScope.showSearch = true
		}

		$rootScope.loadSongs = function(){
			$localForage.getItem('songList').then(function(songs){
				if(undefined != songs && null != songs && songs.length > 0){
					vm.list = songs
					
				}else{

					searchFiles.searchInDirectorys().then(function(songList){
				      	

				      	//obtener la lista

				      	for(var i = 0; i < songList.length; i++){
				      		/*
							items.put("Id", thisId);
			                    items.put("Album", album);
			                    items.put("Author", author);
			                    items.put("Title", title);
			                    items.put("Genre", genero);
			                    items.put("Cover", encoded);
			                    items.put("Duration", Duration);
			                    items.put("Path", thisPath);
				      		*/
				      		//no mostrar los "tonos" solo se muestran canciones mayores a 30s
				      		if(songList[i].Duration > 30000){
					      		var song = {
					      			Id : (songList[i].Title + songList[i].Duration).replace(/\W+/g, "").replace(/\s/g,""),
					      			Title : songList[i].Title,
					      			Duration : songList[i].Duration,
					      			Cover : (songList[i].Cover != "") ? songList[i].Cover : "img/vinyl.png" ,
					      			Author : songList[i].Author,
					      			Genre : songList[i].Genre,
					      			Path : songList[i].Path,
					      			Album : songList[i].Album
					      		}

					      		vm.list.push(song)
				      		}

				      	}

				      	//console.log(vm.list)
				      	//guardar en la base de datos la información de las canciones
				      	$localForage.setItem('songList',vm.list);
				      
				    },function(error){
				      alert(error)
				    })

				}
			})
		}

		$rootScope.loadSongs()
	    /*vm.list = [
	    	{
      			Id : "Sorry1234123",
      			Title : "Sorry",
      			Duration : 12345,
      			Cover : "/sdpath/",
      			Author : "Justin Bieber",
      			Genre : "",
      			Path : "/sdtpa",
      			Album : "Sorry"
      		},
      		{
      			Id : "Puto1235",
      			Title : "Puto",
      			Duration : 12345,
      			Cover : "/sdpath/",
      			Author : "Justin Bieber",
      			Genre : "",
      			Path : "/sdtpa",
      			Album : "Sorry"
      		},
      		{
      			Id : "Pendejo123213",
      			Title : "Pendejo",
      			Duration : 12345,
      			Cover : "/sdpath/",
      			Author : "Justin Bieber",
      			Genre : "",
      			Path : "/sdtpa",
      			Album : "Sorry"
      		},
      		{
      			Id : "Gay235",
      			Title : "Gay",
      			Duration : 12345,
      			Cover : "/sdpath/",
      			Author : "Justin Bieber",
      			Genre : "",
      			Path : "/sdtpa",
      			Album : "Sorry"
      		}
	    ]

	    $localForage.setItem('songList',vm.list);*/

		var viewModal = ''
        $ionicModal.fromTemplateUrl('templates/nowPlaying.html', {
	     scope: $scope,
	     animation: 'slide-in-up'
	    }).then(function(modal) {
	      viewModal = modal;
	    });

	    $rootScope.showPlayNow = function(id,position,showModal){
	    	$rootScope.showSearch = false
	    	vm.songList = ''
	    	vm.searchSong = ''

	    	if(undefined == showModal){
	    		viewModal.show()
	    	}else{
	    		if(showModal == false){
	    			vm.closePlayNow()
	    		}
	    	}

	    	
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

	    $rootScope.closeModal = vm.closePlayNow

	    //disparar evento cuando se cierre el teclado
	    window.addEventListener('native.keyboardhide', function(){
	    	$rootScope.showSearch = false
	    });

		
	}
})();