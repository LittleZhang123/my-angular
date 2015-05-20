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
            width: 170,
            cellTemplate: '<div><a class="btn btn-info" ui-sref="webSortDetail({id:\'{{row.getProperty(col.field)}}\'})" id="{{row.getProperty(col.field)}}">修改</a><a class="btn btn-info" ui-sref="webSortView({id:\'{{row.getProperty(col.field)}}\'})" id="{{row.getProperty(col.field)}}">详情</a><a class="btn btn-danger" ng-click="modalOpen(\'\',\'提示\',\'确定删除\',{isShow:true,Param:row.getProperty(col.field)},{isShow:true})" id="{{row.getProperty(col.field)}}">删除</a></div>'
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
    // var columnDefs =[{        
    //     field: 'TheName',
    //     displayName: '用户名'
    // },{
    //     field: 'Power',
    //     displayName: '权限'
    // }];
    var columnDefs =[
        {field: 'TheName',displayName: '网站分类名称'},
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
        for(var i in oldData){
            if(i===c.field){
                NewData.push({"displayName":c.displayName,"value":oldData[i]});
            }
        }
    });
    //console.log(NewData);
        $scope.table.content=NewData;
        $scope.table.head=$rootScope.$stateParams.table;
    })
    .error(function(data,status,headers,config){
        console.log('error...');
    });
}]);


