'use strict';
var indexApp = angular.module('indexApp',['IndexRouterApp','ui.bootstrap','ui.validate']);
//登陆
indexApp
.controller('LoginCtrl', ['$scope','$http','$location',function ($scope,$http,$location) {


  $scope.notBlackListed = function (value){
    var blacklist = ['zhang@aa.com','zhasssng@aa.com']
    return blacklist.indexOf(value) ===-1
  }

  //登陆事件 提交方式需要修改
  $scope.IsPass=function(){

    var user = {
      TheName:$scope.Login.UserName,
      Password:$scope.Login.Password
    }

    $http({
      method:'POST',
      url:'user/signin',
      data:{"user":user}
    })
    .success(function(data,status,headers,config){
      if(data.isPass){
        sessionStorage.setItem('authenicated', true)
        location.href='/admin.html'
      }else{
        sessionStorage.removeItem('authenicated')
        alert(data.cause)
        $scope.Login.Password=''
      }
    })
    .error(function(data,status,headers,config){

      console.log('异常');
    });
  }
}]);



//注册
indexApp
.controller('registerCtrl', ['$scope','$http','$state',function ($scope,$http,$state) {



  //保存方法
    $scope.submit=function(){
        

        var user=$scope.user;

        $http({
          method:'POST',
          url:'/user/add',
          data:{"user":user}
        })
        .success(function(data,status,headers,config){
            if(data.isSuccess){
              alert('注册成功')
              $state.go('login')
                //modalOpen('','提示','插入成功',{isShow:false},{isShow:false});
            }else{
              alert(data.cause)
                //modalOpen('','提示','插入失败'+data.cause,{isShow:false},{isShow:false});
            }
        })
        .error(function(data,status,headers,config){
            //modalOpen('','提示','插入失败',{isShow:false},{isShow:false});
        });
    };
}]);