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