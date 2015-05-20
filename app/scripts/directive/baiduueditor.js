angular.module('scHelper',[]).directive('ueditor', function () {
  return {
    restrict: 'AE',
    transclude: true,
    replace: true,
    template: '<script type="text/plain" style="min-height:200px;" ng-transclude></script>',
    
    require: '?ngModel',
    scope: {
      config: '='
    },
    link: function (scope, element, attrs, ngModel) {
      
      var editor = new UE.ui.Editor(scope.config || {});
      editor.render(element[0]);
      editor.ready(function(){
      if (ngModel) {
        //Model数据更新时，更新百度UEditor
        editor.setContent(ngModel.$viewValue);

        //百度UEditor数据更新时，更新Model
        editor.addListener('contentChange', function () {
          setTimeout(function () {
            scope.$apply(function () {
              ngModel.$setViewValue(editor.getContent());
            })
          }, 0);
        })
      }
      })

    }
  }
});