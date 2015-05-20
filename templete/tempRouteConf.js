.state('##tableName##List', {
            url:'/##tableName##List',
            views: {
                'content': {
                  'templateUrl': 'views/admin/##tableName##/list.html',
                  'controller':'Ctrl.##tableName##.List'
                }
                
            }
        })
        .state('##tableName##Detail', {
            url:'/##tableName##Detail/{id:[^/]*}',
            views: {
                'content': {
                'templateUrl':'views/admin/##tableName##/detail.html',
                'controller':'Ctrl.##tableName##.Detail'
                }
            }
        })
        .state('##tableName##View', {
            url:'/##tableName##View/{id:[^/]*}',
            views: {
                'content': {
                  'templateUrl': 'views/admin/##tableName##/view.html',
                  'controller':'Ctrl.##tableName##.View'
                }
                
            }
        })