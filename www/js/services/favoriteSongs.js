(function() {
	'use strict';

	angular
	  .module('music-player')
	  .service('favoriteSongs', favoriteSongs);
	  favoriteSongs.$inject = [
	  	'$localForage',
	  	'$q'
	  ]

	function favoriteSongs($localForage,$q) {
		  var vm = this

		  vm.getFavoritSongs = function(){
		  	var deferred = $q.defer()
		  	$localForage.getItem('favoriteSongs').then(function(songs){
		  		 deferred.notify(songs);
		  		if(undefined != songs){
		  			deferred.resolve(songs);
		  		}else{
		     		deferred.resolve([]);
		  		}
		  	})
		  	return deferred.promise;
		  }

		  vm.addtoFavorite = function(id){
		  	 vm.getFavoritSongs().then(function(songs){
		  	 	var currentSongs = songs
		  	 	//buscar la canción
	    		$localForage.getItem('songList').then(function(songList){
    				var currentSong = _.find(songList,{'Id' : id})

    				if(undefined != currentSong && null != currentSong){
    					//console.log('añadiendo => '+currentSong)
    					currentSongs.push(currentSong)
    					$localForage.setItem('favoriteSongs',currentSongs)
    				}
    			})
		  	 })
		  }

		  vm.isFavorite = function(id){
		  	//console.log('Id de la cancion => '+id)
		  	var deferred = $q.defer();
		  	vm.getFavoritSongs().then(function(songs){
		  	 	var currentSongs = songs
		  	 	//console.log(currentSongs)

		  	 	var currentSong = _.find(songs,{'Id' : id})

		  	 	if(undefined != currentSong && null != currentSong){
		  	 		deferred.resolve('true');
		  	 	}else{
		  	 		deferred.resolve('false');
		  	 	}
		  	 	//buscar la canción
		  	 	/*if(currentSongs.length > 0){
		    		for(var i = 0; i < currentSongs.length; i++){
		    			if(currentSongs[i].Id == id){
			    			//no existe la añadimos
			    			//console.log('ya es favorita => '+id)
			    			 deferred.resolve('true');
			    		}else{
			    			//console.log('no es favorita => '+id)
			    			 deferred.resolve('false');
		    			}
		    		}
	    		}else{
	    			deferred.resolve('false');
	    		}*/
		  	 })

		  	return  deferred.promise;
		  }

		  vm.deleteSong = function(id){
		  	 //buscamos la canción
		  	 vm.getFavoritSongs().then(function(songs){
		  	 	var currentSongs = songs
		  	 	//console.log(currentSongs,id)
		  	 	//buscar la canción
		  	 	var currentSong = _.find(currentSongs,{'Id' : id})
		  	 	//console.log(currentSong)

	    		if(undefined != currentSong && null != currentSong){
	    			//no existe la añadimos
	    			var newSongs = _.pull(currentSongs, currentSong);
	    			//console.log(newSongs)
	    			$localForage.setItem('favoriteSongs',newSongs)
	    		}else{
	    			console.log('No existe esta canción')
	    		}
		  	 })
		  }
	}
})();