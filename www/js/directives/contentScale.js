(function() {
	'use strict';

	angular
	  .module('music-player')
	  .directive('ionSideMenuContentScale', ionSideMenuContentScale);
	  ionSideMenuContentScale.$inject = [
	  	'$timeout','$rootScope','$ionicModal'
	  ]

	function ionSideMenuContentScale($timeout,$rootScope,$ionicModal) {
		  return {
		    restrict: 'AC',
		    link: function(scope, element, attrs) {
		      scope.$watch(function() {
		        return element.attr('style');
		      }, function(newValue){
		        if(typeof newValue != "undefined"){
		          var transform = newValue.replace("transform: translate3d","");
		          transform = transform.replace(/[^\w\s]/gi, '');
		          transform = transform.replace(/px/gi, '');
		          var axis = transform.split(" ");
		          if(typeof axis[0] != "undefined" && parseInt(axis[0]) != 0){
		            element.addClass('side-menu-open');
		          }else{
		            element.removeClass('side-menu-open');
		          }

		        }

		      });
		    }
		  }
	}
})();