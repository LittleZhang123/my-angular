'use strict';

angular.module('DataSourceCache',[]).run(['$cacheFactory','$http',function($cacheFactory,$http){
    
    var cache = $cacheFactory('DataSourceCache');
    

    //获取角色
    $http({
      method:'GET',
      url:'/role/list',
      cache:false
    })
    .success(function(data,status,headers,config){
      var Role=[];
      for(var i=0 ;i<data.length;i++){
        var roleOne={}
        roleOne.name=data[i].TheName;
        roleOne.value=data[i]._id;
        Role.push(roleOne)
      }
      cache.put('Role',Role);
    })
    .error(function(data,status,headers,config){
      console.log('error...');
    });


    //获取权限
    $http({
      method:'GET',
      url:'/power/get',
      cache:false
    })
    .success(function(data,status,headers,config){
      cache.put('power',data);
    })
    .error(function(data,status,headers,config){
      console.log('error...');
    });


}]);

