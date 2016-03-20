(function() {
  'use strict';

  angular
    .module('music-player')
    .service('searchFiles', searchFiles);

  searchFiles.$inject = ['$q'];

  function searchFiles($q) {
    //content
      var vm = this
      vm.response = ''

      vm.searchInDirectorys = function(){
         var deferred = $q.defer();
        document.addEventListener('deviceready', function () {
         
          cordova.plugins.getExtPath.coolMethod("getMusic",function(music){
             deferred.resolve(music);
          },function(msg){
            deferred.reject(msg);
          }) //terminal plugin extPath
          
        });
        return deferred.promise;
      }
    
  }
})();