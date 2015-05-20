  'use strict';
  var AdminRouterApp = angular.module('AdminRouterApp', ['ui.router']);


//   AdminRouterApp.factory("SessionService", function () {
//   return {
//     get: function (key) {
//       return sessionStorage.getItem(key);
//     },
//     set: function (key, val) {
//       return sessionStorage.setItem(key, val);
//     },
//     unset: function (key) {
//       return sessionStorage.removeItem(key);
//     }
//   }
// });

// AdminRouterApp.factory("AuthenticationService", function ($http, $location, SessionService) {
//   var cacheSession = function () {
//     SessionService.set('authenicated',true);
//   };
//   var uncacheSession = function () {
//     SessionService.unset('authenicated');
//   };

//   return {
//     isLoggedIn: function () {
//       return SessionService.get('authenicated');
//     },
//     signUp:function(){
//       uncacheSession()
//     }
//   };
// });

  /**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
AdminRouterApp
.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    var routesThatRequireAuth = ['userList','userDetail','userView'];
    $rootScope.$on('$stateChangeStart', function (event,next,current) {
      var isLoggedIn = sessionStorage.getItem('authenicated')
      var isSignIn = !routesThatRequireAuth.contains(next.name) && !isLoggedIn
      if(isSignIn) {
        // $state
        location.href='index.html#/login'
      }
    });
});




// AdminRouterApp.run(function ($rootScope, $location,$rootScope,$state, AuthenticationService) {
//   var routesThatRequireAuth = ['userList'];
//   $rootScope.$on('$routeChangeStart', function (event,next,current) {
//     if(_(routesThatRequireAuth).contains($rootScope.$state.current.name) &&
//       !AuthenticationService.isLoggedIn()) {
//       // $state
//       location.href='index.html/#/login'
//     }
//   });
// });

AdminRouterApp
.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/userList');
    $stateProvider
        .state('userList', {
            url:'/userList',
            views: {
                'content': {
                  'templateUrl': 'views/admin/user/list.html',
                  'controller':'Ctrl.User.List'
                }
                
            }
        })
        .state('userDetail', {
            url:'/userDetail/{id:[^/]*}',
            views: {
                'content': {
                'templateUrl':'views/admin/user/detail.html',
                'controller':'Ctrl.User.Detail'
                }
            }
        })
        .state('userView', {
            url:'/userView/{id:[^/]*}',
            views: {
                'content': {
                  'templateUrl': 'views/admin/user/view.html',
                  'controller':'Ctrl.User.View'
                }
                
            }
        })
        .state('roleList', {
            url:'/roleList',
            views: {
                'content': {
                  'templateUrl': 'views/admin/role/list.html',
                  'controller':'Ctrl.Role.List'
                }
                
            }
        })
        .state('roleDetail', {
            url:'/roleDetail/{id:[^/]*}',
            views: {
                'content': {
                'templateUrl':'views/admin/role/detail.html',
                'controller':'Ctrl.Role.Detail'
                }
            }
        })
        .state('roleView', {
            url:'/roleView/{id:[^/]*}',
            views: {
                'content': {
                  'templateUrl': 'views/admin/role/view.html',
                  'controller':'Ctrl.Role.View'
                }
                
            }
        })
        .state('webSortList', {
            url:'/webSortList',
            views: {
                'content': {
                  'templateUrl': 'views/admin/webSort/list.html',
                  'controller':'Ctrl.webSort.List'
                }
                
            }
        })
        .state('webSortDetail', {
            url:'/webSortDetail/{id:[^/]*}',
            views: {
                'content': {
                'templateUrl':'views/admin/webSort/detail.html',
                'controller':'Ctrl.webSort.Detail'
                }
            }
        })
        .state('webSortView', {
            url:'/webSortView/{id:[^/]*}',
            views: {
                'content': {
                  'templateUrl': 'views/admin/webSort/view.html',
                  'controller':'Ctrl.webSort.View'
                }
                
            }
        })
        .state('advadd', {
            url:'/advadd/{id:[^/]*}',
            views: {
                'content': {
                'templateUrl':'views/admin/advadd.html',
                'controller':''
                }
            }
        })
        .state('message', {
            url:'/message',
            views: {
                'content': {
                'templateUrl':'views/admin/Mes.html',
                'controller':''
                }
            }
        })
        .state('test', {
            url:'/test',
            views: {
                'content': {
                'templateUrl':'views/admin/test.html',
                'controller':'ctrl.input.file'
                }
            }
        })
        
  });