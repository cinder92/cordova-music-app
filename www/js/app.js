(function(){
  'use strict'
  angular.module('music-player', ['ionic','ngCordova','LocalForageModule','angularRipple'])

  .run(function($ionicPlatform,$rootScope,$cordovaStatusbar,$localForage) {
    $rootScope.hideMiniControls = false

    //themes
    var themes = [
      { 
        id : 'brown',
        name : 'Brown',
        active : 1
      },
      { 
        id : 'material',
        name : 'Material',
        active : 0
      },
      { 
        id : 'dark',
        name : 'Dark',
        active : 0
      }
    ]

    $rootScope.style = 'brown'

    $localForage.getItem('themes').then(function(t){
      var current = _.find(t,{'active':1})
      console.log(current)
      if(undefined == current || null == current){
        $rootScope.style = themes[0].id
      }else{
        $rootScope.style = current.id
      }


      switch($rootScope.style){
        case 'material':
          window.plugins.tintstatusbar.setColor('#004540')
        break;
        
        default:
        case 'brown':
          window.plugins.tintstatusbar.setColor('#291e22')
        break;
      }

    })

    $ionicPlatform.ready(function() {

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
     
      // org.apache.cordova.statusbar required
      //window.plugins.tintstatusbar.setColor('#4E407D')
      if (cordova.platformId == 'android') {
          //console.log('soy => '+cordova.platformId)
          //statusbarTransparent.enable()
          switch($rootScope.style){
            case 'material':
              window.plugins.tintstatusbar.setColor('#004540')
            break;
            
            default:
            case 'brown':
              window.plugins.tintstatusbar.setColor('#291e22')
            break;
          }
      }
        

        //servicio de background https://github.com/phpsa/cbsp
       $rootScope.inBackground = false
       document.addEventListener('pause',function(){
          $rootScope.inBackground = true

          cordova.plugins.backgroundMode.configure({
              title: 'Runing Vigets Player'
          })

          cordova.plugins.backgroundMode.enable();
          //var bgservice = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService');

           // Called when background mode has been activated
          cordova.plugins.backgroundMode.onactivate = function() {
            // if track was playing resume it
            setInterval(function () {
                if($rootScope.songhasend){
                   $rootScope.nextSong($rootScope.songPosition);
                }
                // Modify the currently displayed notification
                /*cordova.plugins.backgroundMode.configure({
                    text:'Running in background for more than 5s now.'
                });*/
            }, 1000);
          }
       },false)

       document.addEventListener('resume',function(){
          $rootScope.inBackground = false
          cordova.plugins.backgroundMode.disable();
       },false)

      /*bgservice.getStatus(function(e){
         if(e.Success){
            //iniciamos el servicio
            bgservice.startService(function(r) {
                console.log('servicio started => '+r)
            },function(e) {
                console.log('servicio not started => '+JSON.stringify(e))
            });

            //cada 1s verificará si la canción se detuvo
            bgservice.enableTimer(1000,function(r) {
                console.log('timer started => '+r)
            },function(e) {
               console.log('timer not started => '+JSON.stringify(e))
            });

            bgservice.registerForUpdates(function(r) {
                console.log('register for update! => '+r)
            },function(e) {
                 console.log('not register for update! => '+JSON.stringify(e))
            });
         }
      })*/
    });
  })

  .config(function($stateProvider, $urlRouterProvider,$localForageProvider) {
    
    //obtener el tema actual



  

    //configurando la base de datos, almacenará la información de la música,
    //así como las listas de reproducción y demás configuraciones
    $localForageProvider.config({
        driver      : localforage.WEBSQL, // if you want to force a driver
        name        : 'music-player', // name of the database and prefix for your data, it is "lf" by default
        version     : 1.0, // version of the database, you shouldn't have to use this
        storeName   : 'keyvaluepairs' // name of the table
    });


    $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

    .state('app.songlist', {
      url: '/songlist',
      views: {
        'menuContent': {
          templateUrl: 'templates/songList.html',
          controller: 'songListCtrl as songList'
        }
      }
    })

    .state('app.favourites', {
      url: '/favourites',
      views: {
        'menuContent': {
          templateUrl: 'templates/favourites.html',
          controller: 'favouritesCtrl as favourite'
        }
      }
    })

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'playlistCtrl as playlist'
        }
      }
    })

    .state('app.playlistsongs', {
      url: '/songs/:pid',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlist-songs.html',
          controller: 'playlistSongCtrl as plsongs'
        }
      }
    })

    .state('app.songdetails', {
      url: '/song/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/songDetails.html',
          controller: 'songDetailsCtrl as song'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'settingsCtrl as settings'
        }
      }
    })

    /*.state('app.nowplaying', {
      url: '/nowplaying/:id/:position/:play',
      views: {
        'menuContent': {
          templateUrl: 'templates/nowPlaying.html',
          controller: 'nowPlayingCtrl as playing'
        }
      }
    })*/


    /*.state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })

    .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      
    .state('app.single', {
      url: '/playlists/:playlistId',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    });*/
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/songlist');
   
  });

})();