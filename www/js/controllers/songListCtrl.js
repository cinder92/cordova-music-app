(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('songListCtrl', songListCtrl);

	songListCtrl.$inject = ['$q','$cordovaDialogs','$ionicLoading','$rootScope','$scope','$ionicModal','$cordovaFile','searchFiles','$localForage'];

	function songListCtrl($q,$cordovaDialogs,$ionicLoading,$rootScope,$scope,$ionicModal,$cordovaFile,searchFiles,$localForage) {
		//content
		var vm = this
		vm.list = ''
		vm.songList = ''
		vm.searchSong = ''

		$rootScope.globalSearch = function(){
			$rootScope.showSearch = true
		}

		//deseas actualizar la lista de canciones automáticamente?
		$rootScope.refreshSongs = function(){
			$ionicLoading.show({
		      template: '<ion-spinner></ion-spinner><p>Please wait ...</p>'
		    });
			$localForage.getItem('songList').then(function(songs){
				if(undefined != songs && null != songs && songs.length > 0){
					//vm.list = songs
					
					getAllSongsfromDevice().then(function(all){
						if(songs.length < all.length){
							var local = songs.length,
							device = all.length,
							resta = (device - local) + 1

							for(var i = 1; i < resta; i++){
								//newSongs.push(all[all.length-i]);
								songs.push(all[all.length-i])
							}
							
							//console.log(songs)
							$localForage.setItem('songList',songs);
							vm.list = songs

						}
					})
				}else{

		      	//console.log(vm.list)
		      		getAllSongsfromDevice().then(function(songs){
		      			vm.list = songs
		      			$localForage.setItem('songList',vm.list);
		      		});
		      	
		      	}
		      	$ionicLoading.hide()
				
			})

			//console.log(vm.list)
		}

		$rootScope.loadSongs = function(){

			$ionicLoading.show({
		      template: '<ion-spinner></ion-spinner><p>Please wait ...</p>'
		    });

			$localForage.getItem('songList').then(function(songs){
				if(undefined != songs && null != songs && songs.length > 0){
					vm.list = songs
					vm.list.sort(function(a,b){
					      var textA = a.Title.toUpperCase();
					      var textB = b.Title.toUpperCase();
					      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
					})
					$ionicLoading.hide()
				}else{
					vm.list = []
					/*searchFiles.searchInDirectorys().then(function(songList){
				      	

				      	//obtener la lista

				      	for(var i = 0; i < songList.length; i++){
				      		
				      		//no mostrar los "tonos" solo se muestran canciones mayores a 30s
				      		if(songList[i].Duration > 30000){
					      		var song = {
					      			Id : (songList[i].Title + songList[i].Duration).replace(/\W+/g, "").replace(/\s/g,""),
					      			Title : songList[i].Title,
					      			Duration : songList[i].Duration,
					      			Cover : (songList[i].Cover != "") ? songList[i].Cover : "img/vinyl.png" ,
					      			Blur : (songList[i].Blur != "") ? songList[i].Blur : "img/vinyl.png" ,
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

				      	$ionicLoading.hide()
				      
				    },function(error){
				      alert(error)
				    })*/
				    getAllSongsfromDevice().then(function(allsongs){
				    	vm.list = allsongs
				    	vm.list.sort(function(a,b){
						      var textA = a.Title.toUpperCase();
						      var textB = b.Title.toUpperCase();
						      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
						})
				    	$localForage.setItem('songList',vm.list);

				      	$ionicLoading.hide()

				    })

				}
			})
			//$rootScope.refreshSongs() // verificar si hay alguna nueva
		}

		$rootScope.loadSongs() //cargar las canciones
		

		function getAllSongsfromDevice(){
			var files = []
			var deferred = $q.defer();
			searchFiles.searchInDirectorys().then(function(songList){

		      	for(var i = 0; i < songList.length; i++){
		      		
		      		//no mostrar los "tonos" solo se muestran canciones mayores a 30s
		      		if(songList[i].Duration > 30000){
			      		var song = {
			      			Id : (songList[i].Title + songList[i].Duration).replace(/\W+/g, "").replace(/\s/g,""),
			      			Title : songList[i].Title,
			      			Duration : songList[i].Duration,
			      			Cover : (songList[i].Cover != "") ? songList[i].Cover : "img/vinyl.png" ,
			      			Blur : (songList[i].Blur != "") ? songList[i].Blur : "img/vinyl.png" ,
			      			Author : songList[i].Author,
			      			Genre : songList[i].Genre,
			      			Path : songList[i].Path,
			      			Album : songList[i].Album
			      		}

			      		files.push(song)
		      		}

		      	}

		      	deferred.resolve(files)
		    },function(error){
		    	deferred.reject(error)
		    })

		    return deferred.promise

		}

	    /*vm.list = [
	    	{
      			Id : "Sorry1234123",
      			Title : "Sorry",
      			Duration : 12345,
      			Cover : "http://www.covershut.com/covers/Mago-De-Oz-La-Ciudad-De-Los-Arboles-Front-Cover-38317.jpg",
      			Author : "Justin Bieber",
      			Genre : "",
      			Path : "/sdtpa",
      			Album : "Sorry"
      		},
      		{
      			Id : "Puto1235",
      			Title : "Puto",
      			Duration : 12345,
      			Cover : "http://www.covershut.com/covers/Mago-De-Oz-La-Ciudad-De-Los-Arboles-Front-Cover-38317.jpg",
      			Author : "Justin Bieber",
      			Genre : "",
      			Path : "/sdtpa",
      			Album : "Sorry"
      		},
      		{
      			Id : "Pendejo123213",
      			Title : "Pendejo",
      			Duration : 12345,
      			Cover : "http://www.covershut.com/covers/Mago-De-Oz-La-Ciudad-De-Los-Arboles-Front-Cover-38317.jpg",
      			Author : "Justin Bieber",
      			Genre : "",
      			Path : "/sdtpa",
      			Album : "Sorry"
      		},
      		{
      			Id : "Gay235",
      			Title : "Gay",
      			Duration : 12345,
      			Cover : "http://www.covershut.com/covers/Mago-De-Oz-La-Ciudad-De-Los-Arboles-Front-Cover-38317.jpg",
      			Author : "Justin Bieber",
      			Genre : "",
      			Path : "/sdtpa",
      			Album : "Sorry"
      		},{
      			Id : "Gay2352",
      			Title : "Gay2",
      			Duration : 1234522,
      			Cover : "http://www.covershut.com/covers/Mago-De-Oz-La-Ciudad-De-Los-Arboles-Front-Cover-38317.jpg",
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