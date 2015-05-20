'use strict';
var adminApp=angular.module('adminApp',['AdminRouterApp','ui.bootstrap','ngGrid','ui.select2','scHelper','angularFileUpload','DataSourceCache']);

//面板
adminApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, headText,bodyText,okConfig,cancelConfig) {

  $scope.headText = headText;
  $scope.bodyText = bodyText;

  $scope.isShowOk=okConfig.isShow
  $scope.isShowCancel=cancelConfig.isShow

  $scope.ok = function () {
    $modalInstance.close(okConfig.Param);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss(cancelConfig.Param);
  };
});

//顶导航条
adminApp.controller('head.Ctrl',['$scope','$http',function($scope,$http){
    $scope.userName='游客'
    $scope.quit = function(){
        $http({
          method:'GET',
          url:'user/signUp'
        })
        .success(function(data,status,headers,config){
            if(data.isSuccess){
                sessionStorage.removeItem('authenicated')
                location.href='index.html#/login'
            }else{
                console.log('异常退出');
            }
            
        })
        .error(function(data,status,headers,config){
            console.log('error...');
        });
        
    }
}])

//导航条
adminApp.controller('NavCtrl',['$scope','$http',function ($scope,$http) {
    var cacheData=[];
    if(cacheData.length===0){
        $http({
          method:'GET',
          url:'admin/nav.json',
          cache:true
          }).success(function(data,status,headers,config){
              $scope.roots = data;
              cacheData=data;
          }).error(function(data,status,headers,config){
              console.log('error...');
          });
      }else{
        $scope.roots=cacheData;
    }
}]);

//Ctrl.User.List
adminApp.controller('Ctrl.User.List',['$cacheFactory','$rootScope','$scope','$http', '$modal',function($cacheFactory,$rootScope,$scope, $http,$modal) {
    console.log($rootScope.$state.current);
    
    $scope.$stateParams=$rootScope.$stateParams;
    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: true
    }; 

    var cacheData=[];
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 50],
        pageSize: 5,
        currentPage: 1
    };	

    $scope.setPagingData = function(data, page, pageSize){	
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.reflash=function(){
        cacheData=[];
        $scope.filterOptions.filterText='';
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                if(cacheData.length===0){
                    $http.get('user/list').success(function (largeLoad) {     
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    });  
                }else{
                    data = cacheData.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                }

            } else {
                if(cacheData.length===0){
                    $http.get('user/list').success(function (largeLoad) {
                        cacheData=largeLoad;
                        $scope.setPagingData(largeLoad,page,pageSize);
                    });
                }else{
                    $scope.setPagingData(cacheData,page,pageSize);
                }
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);


    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    //删除用户函数
    var deleteOne = function(id){
        $http({
          method:'delete',
          url:'user/deleteOne/'+id
        })
        .success(function(data,status,headers,config){
          if(data.isSuccess){
            $scope.reflash()
          }else{
            console.log(data.cause)
          }
        })
        .error(function(data,status,headers,config){
              console.log('error...');
        });
    }

    //面板打开
    $scope.modalOpen = function (size,headText,bodyText,okConfig,cancelConfig) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            headText: function () {
              return headText
            },
            bodyText:function(){
                return bodyText
            },
            okConfig:function(){
                return okConfig
            },
            cancelConfig:function(){
                return cancelConfig
            }
        }
    });
    //点击确定
    modalInstance.result.then(function (okParam) {
      deleteOne(okParam)
    },
    function (cancelParam) {
      //console.log(cancelParam)
    });
  };

    $scope.gridOptions = {
        data: 'myData',
            // rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            //     '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            //     '<div ng-cell></div>' +
            //     '</div></div>',
        enablePinning: true,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [{
            displayName: '序号',
            width: 60,
            sortable: false,
            pinned: true,
            cellTemplate:'<div style="text-align: center;">{{row.rowIndex+1}}</div>'
        }, {
            field: 'TheName',
            displayName: '用户名',
        }, {
            field: 'Password',
            displayName: '密码',
            width: 320
        }, {
            field: 'Role',
            displayName: '角色',
            width: 120
        },{
            field: '_id',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            width: 80,
            cellTemplate: '<div class="menu-list"><a class="text-success btn-list" ui-sref="userDetail({id:\'{{row.getProperty(col.field)}}\'})" id="{{row.getProperty(col.field)}}"><i class="icon-pencil icon-large"></i></a><a class="text-info btn-list" ui-sref="userView({id:\'{{row.getProperty(col.field)}}\'})" id="{{row.getProperty(col.field)}}"><i class="icon-bar-chart icon-large"></i></a><a class="text-danger btn-list" ng-click="modalOpen(\'\',\'提示\',\'确定删除\',{isShow:true,Param:row.getProperty(col.field)},{isShow:true})" id="{{row.getProperty(col.field)}}"><i class="icon-trash icon-large"></i></a></div>'
        }]
    };
}]);


//View
adminApp.controller('Ctrl.User.View',['$cacheFactory','$rootScope','$scope','$http',function ($cacheFactory,$rootScope,$scope,$http) {
    var _id = $rootScope.$stateParams.id
    if(!_id){
        return
    }

    //配置
    $scope.table={
        head:'',
        content:{}
    };
    var columnDefs =[{        
        field: 'TheName',
        displayName: '用户名'
    },{
        field: 'Password',
        displayName: '密码'
    },{
        field:'IsUse',
        displayName:'是否启用'
    },{
        field:'IsDelete',
        displayName:'是否删除'
    },{
        field:'Remark',
        displayName:'备注'
    },{
        perField:'meta',
        field:'createAt',
        displayName:'创建时间'
    },{
        perField:'meta',
        field:'updateAt',
        displayName:'更新时间'
    },{
        perField:'meta',
        field:'createUser',
        displayName:'创建人'
    },{
        perField:'meta',
        field:'updateUser',
        displayName:'更新人'
    }];
    
    //数据获取
    $http({
      method:'GET',
      url:'user/findOne/'+_id
    })
    .success(function(data,status,headers,config){
        var NewData=[];
        var oldData=data;
        angular.forEach(columnDefs,function(c){
            var fieldValue = c.perField?oldData[c.perField][c.field]:oldData[c.field];
            NewData.push({"displayName":c.displayName,"value":fieldValue});
        });
        $scope.table.content=NewData;
        $scope.table.head=$rootScope.$stateParams.table;
    })
    .error(function(data,status,headers,config){
        console.log('error...');
    });
}]);

//Detail
adminApp.controller('Ctrl.User.Detail',['$cacheFactory','$rootScope','$scope','$http','$modal','$state',function ($cacheFactory,$rootScope,$scope,$http,$modal,$state) {
    // $scope.columnDefs=[
    //         {'field':'TheName','displayname':'账号','controltype':'stringinput','placeholder':'输入账号'},
    //         {'field':'Password','displayname':'密码','controltype':'passwordinput','placeholder':'输入密码'},
    //         {'field':'RealName','displayname':'真实名字','controltype':'stringinput','placeholder':'输入真实名字'},
    //         {'field':'Role','displayname':'角色选择','controltype':'singleselectinput','options':'Role'},
    //         // {'field':'Power','displayname':'权限选择','controltype':'multipleselectinput','options':'Powers'},
    //         {'field':'IsUse','displayname':'是否启用','controltype':'checkboxinput'},
    //         {'field':'IsDelete','displayname':'是否删除','controltype':'checkboxinput'},
    //         {'field':'Remark','displayname':'备注','controltype':'textareainput','placeholder':''}
    //     ];
    var cache = $cacheFactory.get('DataSourceCache');
    $scope.roleOptions = cache.get('Role')
    
    //面板打开
    var modalOpen = function (size,headText,bodyText,okConfig,cancelConfig) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            headText: function () {
              return headText
            },
            bodyText:function(){
                return bodyText
            },
            okConfig:function(){
                return okConfig
            },
            cancelConfig:function(){
                return cancelConfig
            }
        }
    });
    //点击确定
    modalInstance.result.then(function (okParam) {
    },
    function (cancelParam) {
      $state.go('userList')
    });
  };

    
    //保存方法
    $scope.submit=function(){
        

        var user=$scope.epData;

        console.log(user)
        $http({
          method:'POST',
          url:'/user/add',
          data:{"user":user}
        })
        .success(function(data,status,headers,config){
            if(data.isSuccess){
                modalOpen('','提示','操作成功',{isShow:false},{isShow:false});
            }else{
                modalOpen('','提示','操作失败'+data.cause,{isShow:false},{isShow:false});
            }
        })
        .error(function(data,status,headers,config){
            modalOpen('','提示','操作失败',{isShow:false},{isShow:false});
        });
    };

    var _id = $rootScope.$stateParams.id
    if(!_id){
        $scope.epData={
            IsUse:true
        }
        return;
    }

    //获取数据
    $http({
      method:'GET',
      url:'user/findOne/'+_id
    })
    .success(function(data,status,headers,config){
        if(data){
            $scope.epData=data;
        }else{
            $scope.epData={
                IsUse:true
            }
        }
    })
    .error(function(data,status,headers,config){
        console.log('error...');
    });
}]);

//文件上传
// adminApp.controller('ctrl.input.file',['$scope', '$fileUploader',function ($scope, $fileUploader) {
//   var vm = $scope.vm = {};
//   vm.uploader = $fileUploader.create({
//     scope: $scope,
//     url: '/api/upload',
//     autoUpload: true,   // 自动开始上传
//     formData: [          // 和文件内容同时上传的form参数
//       { key: 'value' }
//     ],
//     filters: [           // 过滤器，可以对每个文件进行处理
//       function (item) {
//         console.info('filter1', item);
//         return true;
//       }
//     ]
//   });
// }]);


//Ctrl.Role.List
adminApp.controller('Ctrl.Role.List',['$cacheFactory','$rootScope','$scope','$http', '$modal',function($cacheFactory,$rootScope,$scope, $http,$modal) {


    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: true
    }; 

    var cacheData=[];
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 50],
        pageSize: 5,
        currentPage: 1
    };  

    $scope.setPagingData = function(data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.reflash=function(){
        cacheData=[];
        $scope.filterOptions.filterText='';
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                if(cacheData.length===0){
                    $http.get('role/list').success(function (largeLoad) {        
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    });  
                }else{
                    data = cacheData.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                }

            } else {
                if(cacheData.length===0){
                    $http.get('role/list').success(function (largeLoad) {
                        cacheData=largeLoad;
                        $scope.setPagingData(largeLoad,page,pageSize);
                    });
                }else{
                    $scope.setPagingData(cacheData,page,pageSize);
                }
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);


    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    //删除用户函数
    var deleteOne = function(id){
        $http({
          method:'delete',
          url:'role/deleteOne/'+id
        })
        .success(function(data,status,headers,config){
          if(data.isSuccess){
            $scope.reflash()
          }else{
            console.log(data.cause)
          }
        })
        .error(function(data,status,headers,config){
              console.log('error...');
        });
    }

    //面板打开
    $scope.modalOpen = function (size,headText,bodyText,okConfig,cancelConfig) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            headText: function () {
              return headText
            },
            bodyText:function(){
                return bodyText
            },
            okConfig:function(){
                return okConfig
            },
            cancelConfig:function(){
                return cancelConfig
            }
        }
    });
    //点击确定
    modalInstance.result.then(function (okParam) {
      deleteOne(okParam)
    },
    function (cancelParam) {
      //console.log(cancelParam)
    });
  };

    $scope.gridOptions = {
        data: 'myData',
            // rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            //     '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            //     '<div ng-cell></div>' +
            //     '</div></div>',
        enablePinning: true,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [{
            displayName: '序号',
            width: 60,
            sortable: false,
            pinned: true,
            cellTemplate:'<div style="text-align: center;">{{row.rowIndex+1}}</div>'
        }, {
            field: 'TheName',
            displayName: '用户名',
        }, {
            field: 'Power',
            displayName: '角色',
            width: 120
        },{
            field: '_id',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            width: 80,
            cellTemplate: '<div class="menu-list"><a class="text-success btn-list" ui-sref="roleDetail({id:\'{{row.getProperty(col.field)}}\'})" id="{{row.getProperty(col.field)}}"><i class="icon-pencil icon-large"></i></a><a class="text-info btn-list" ui-sref="roleView({id:\'{{row.getProperty(col.field)}}\'})" id="{{row.getProperty(col.field)}}"><i class="icon-bar-chart icon-large"></i></a><a class="text-danger btn-list" ng-click="modalOpen(\'\',\'提示\',\'确定删除\',{isShow:true,Param:row.getProperty(col.field)},{isShow:true})" id="{{row.getProperty(col.field)}}"><i class="icon-trash icon-large"></i></a></div>'
        }]
    };
}]);


//Detail
adminApp.controller('Ctrl.Role.Detail',['$cacheFactory','$rootScope','$scope','$http','$modal','$state',function ($cacheFactory,$rootScope,$scope,$http,$modal,$state) {

    var cache = $cacheFactory.get('DataSourceCache');
    var powerArray = cache.get('power');

    $scope.PowerDataSource = {
            'multiple': true,
            'simple_tags': true,
            'tags': powerArray
        };
    
    //面板打开
    var modalOpen = function (size,headText,bodyText,okConfig,cancelConfig) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            headText: function () {
              return headText
            },
            bodyText:function(){
                return bodyText
            },
            okConfig:function(){
                return okConfig
            },
            cancelConfig:function(){
                return cancelConfig
            }
        }
    });
    //点击确定
    modalInstance.result.then(function (okParam) {
    },
    function (cancelParam) {
      $state.go('roleList')
    });
  };

    
    //保存方法
    $scope.submit=function(){
        
        var role=$scope.epData;

        $http({
          method:'POST',
          url:'/role/add',
          data:{"role":role}
        })
        .success(function(data,status,headers,config){
            if(data.isSuccess){
                modalOpen('','提示','操作成功',{isShow:false},{isShow:false});
            }else{
                modalOpen('','提示','操作失败'+data.cause,{isShow:false},{isShow:false});
            }
        })
        .error(function(data,status,headers,config){
            modalOpen('','提示','操作失败',{isShow:false},{isShow:false});
        });
    };

    var _id = $rootScope.$stateParams.id
    if(!_id){
        $scope.epData={
            IsUse:true
        }
        return;
    }

    //获取数据
    $http({
      method:'GET',
      url:'role/findOne/'+_id
    })
    .success(function(data,status,headers,config){
        if(data){
            $scope.epData=data;
        }else{
            $scope.epData={
                IsUse:true
            }
        }
    })
    .error(function(data,status,headers,config){
        console.log('error...');
    });
}]);


//Ctrl.User.View
adminApp.controller('Ctrl.Role.View',['$cacheFactory','$rootScope','$scope','$http',function ($cacheFactory,$rootScope,$scope,$http) {
    var _id = $rootScope.$stateParams.id
    if(!_id){
        return
    }

    //配置
    $scope.table={
        head:'',
        content:{}
    };
    var columnDefs =[{        
        field: 'TheName',
        displayName: '用户名'
    },{
        field: 'Power',
        displayName: '权限'
    },{
        field:'IsUse',
        displayName:'是否启用'
    },{
        field:'IsDelete',
        displayName:'是否删除'
    },{
        field:'Remark',
        displayName:'备注'
    },{
        perField:'meta',
        field:'createAt',
        displayName:'创建时间'
    },{
        perField:'meta',
        field:'updateAt',
        displayName:'更新时间'
    },{
        perField:'meta',
        field:'createUser',
        displayName:'创建人'
    },{
        perField:'meta',
        field:'updateUser',
        displayName:'更新人'
    }];
    
    //数据获取
    $http({
      method:'GET',
      url:'role/findOne/'+_id
    })
    .success(function(data,status,headers,config){
        var NewData=[];
        var oldData=data;
        angular.forEach(columnDefs,function(c){
            var fieldValue = c.perField?oldData[c.perField][c.field]:oldData[c.field];
            NewData.push({"displayName":c.displayName,"value":fieldValue});
        });
    //console.log(NewData);
        $scope.table.content=NewData;
        $scope.table.head=$rootScope.$stateParams.table;
    })
    .error(function(data,status,headers,config){
        console.log('error...');
    });
}]);


//webSort
//Ctrl.webSort.List
adminApp.controller('Ctrl.webSort.List',['$cacheFactory','$rootScope','$scope','$http', '$modal',function($cacheFactory,$rootScope,$scope, $http,$modal) {


    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: true
    }; 

    var cacheData=[];
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 50],
        pageSize: 5,
        currentPage: 1
    };  

    $scope.setPagingData = function(data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.reflash=function(){
        cacheData=[];
        $scope.filterOptions.filterText='';
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                if(cacheData.length===0){
                    $http.get('webSort/list').success(function (largeLoad) {        
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    });  
                }else{
                    data = cacheData.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                }

            } else {
                if(cacheData.length===0){
                    $http.get('webSort/list').success(function (largeLoad) {
                        cacheData=largeLoad;
                        $scope.setPagingData(largeLoad,page,pageSize);
                    });
                }else{
                    $scope.setPagingData(cacheData,page,pageSize);
                }
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);


    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    //删除用户函数
    var deleteOne = function(id){
        $http({
          method:'delete',
          url:'webSort/deleteOne/'+id
        })
        .success(function(data,status,headers,config){
          if(data.isSuccess){
            $scope.reflash()
          }else{
            console.log(data.cause)
          }
        })
        .error(function(data,status,headers,config){
              console.log('error...');
        });
    }

    //面板打开
    $scope.modalOpen = function (size,headText,bodyText,okConfig,cancelConfig) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            headText: function () {
              return headText
            },
            bodyText:function(){
                return bodyText
            },
            okConfig:function(){
                return okConfig
            },
            cancelConfig:function(){
                return cancelConfig
            }
        }
    });
    //点击确定
    modalInstance.result.then(function (okParam) {
      deleteOne(okParam)
    },
    function (cancelParam) {
      //console.log(cancelParam)
    });
  };

    $scope.gridOptions = {
        data: 'myData',
            // rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            //     '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            //     '<div ng-cell></div>' +
            //     '</div></div>',
        enablePinning: true,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [{
            displayName: '序号',
            width: 60,
            sortable: false,
            pinned: true,
            cellTemplate:'<div style="text-align: center;">{{row.rowIndex+1}}</div>'
        }, 
        {field: 'TheName',displayName: '网站分类名称'},
        {
            field: '_id',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            width: 80,
            cellTemplate: '<div class="menu-list"><a class="text-success btn-list" ui-sref="webSortDetail({id:\'{{row.getProperty(col.field)}}\'})" id="{{row.getProperty(col.field)}}"><i class="icon-pencil icon-large"></i></a><a class="text-info btn-list" ui-sref="webSortView({id:\'{{row.getProperty(col.field)}}\'})" id="{{row.getProperty(col.field)}}"><i class="icon-bar-chart icon-large"></i></a><a class="text-danger btn-list" ng-click="modalOpen(\'\',\'提示\',\'确定删除\',{isShow:true,Param:row.getProperty(col.field)},{isShow:true})" id="{{row.getProperty(col.field)}}"><i class="icon-trash icon-large"></i></a></div>'
        }]
    };
}]);


//Detail
adminApp.controller('Ctrl.webSort.Detail',['$cacheFactory','$rootScope','$scope','$http','$modal','$state',function ($cacheFactory,$rootScope,$scope,$http,$modal,$state) {

    // var cache = $cacheFactory.get('DataSourceCache');
    // var powerArray = cache.get('power');

    // $scope.PowerDataSource = {
    //         'multiple': true,
    //         'simple_tags': true,
    //         'tags': powerArray
    //     };
    
    //面板打开
    var modalOpen = function (size,headText,bodyText,okConfig,cancelConfig) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            headText: function () {
              return headText
            },
            bodyText:function(){
                return bodyText
            },
            okConfig:function(){
                return okConfig
            },
            cancelConfig:function(){
                return cancelConfig
            }
        }
    });
    //点击确定
    modalInstance.result.then(function (okParam) {
    },
    function (cancelParam) {
      $state.go('webSortList')
    });
  };

    
    //保存方法
    $scope.submit=function(){
        
        var webSort=$scope.epData;

        $http({
          method:'POST',
          url:'/webSort/add',
          data:{"webSort":webSort}
        })
        .success(function(data,status,headers,config){
            if(data.isSuccess){
                modalOpen('','提示','操作成功',{isShow:false},{isShow:false});
            }else{
                modalOpen('','提示','操作失败'+data.cause,{isShow:false},{isShow:false});
            }
        })
        .error(function(data,status,headers,config){
            modalOpen('','提示','操作失败',{isShow:false},{isShow:false});
        });
    };

    var _id = $rootScope.$stateParams.id
    if(!_id){
        $scope.epData={
            IsUse:true
        }
        return;
    }

    //获取数据
    $http({
      method:'GET',
      url:'webSort/findOne/'+_id
    })
    .success(function(data,status,headers,config){
        if(data){
            $scope.epData=data;
        }else{
            $scope.epData={
                IsUse:true
            }
        }
    })
    .error(function(data,status,headers,config){
        console.log('error...');
    });
}]);


//Ctrl.webSort.View
adminApp.controller('Ctrl.webSort.View',['$cacheFactory','$rootScope','$scope','$http',function ($cacheFactory,$rootScope,$scope,$http) {
    var _id = $rootScope.$stateParams.id
    if(!_id){
        return
    }

    //配置
    $scope.table={
        head:'',
        content:{}
    };
    var columnDefs =[
        {field: 'TheName',displayName: '网站分类名称'},
        {
            field:'IsUse',
            displayName:'是否启用'
        },{
            field:'IsDelete',
            displayName:'是否删除'
        },{
            field:'Remark',
            displayName:'备注'
        },{
            perField:'meta',
            field:'createAt',
            displayName:'创建时间'
        },{
            perField:'meta',
            field:'updateAt',
            displayName:'更新时间'
        },{
            perField:'meta',
            field:'createUser',
            displayName:'创建人'
        },{
            perField:'meta',
            field:'updateUser',
            displayName:'更新人'
        }
    ];
    //数据获取
    $http({
      method:'GET',
      url:'webSort/findOne/'+_id
    })
    .success(function(data,status,headers,config){
        var NewData=[];
        var oldData=data;
        angular.forEach(columnDefs,function(c){
            var fieldValue = c.perField?oldData[c.perField][c.field]:oldData[c.field];
            NewData.push({"displayName":c.displayName,"value":fieldValue});
        });
    //console.log(NewData);
        $scope.table.content=NewData;
        $scope.table.head=$rootScope.$stateParams.table;
    })
    .error(function(data,status,headers,config){
        console.log('error...');
    });
}]);




