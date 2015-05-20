'use strict';
angular.module('EditPage',['EditPage.forminput','EditPage.tpl','EditPage.commoninput','EditPage.checkboxinput','EditPage.singleselectinput','EditPage.multipleselectinput','EditPage.datepickerinput']);
angular.module('EditPage.tpl',['EditPage.commoninputtemplate','EditPage.textareainputtemplate','EditPage.textareainput','EditPage.checkboxinputtemplate','EditPage.singleselectinputtemplate','EditPage.multipleselecttemplate','EditPage.datepickerinputtemplate']);

//验证以后再写
angular.module('EditPage.commoninput',[]).directive('commoninput',function(){
	return{
		restrict:'AE',
		scope:{
			type:'@',
			displayname:'@',
			placeholder:'@',
			inputcontent:'='
		},
		templateUrl:'commoninputtemplate',
		replace:true
		
	};
});


//验证以后再写
angular.module('EditPage.textareainput',[]).directive('textareainput',function(){
	return{
		restrict:'AE',
		scope:{
			displayname:'@',
			placeholder:'@',
			inputcontent:'='
		},
		templateUrl:'textareainputtemplate',
		replace:true
		
	};
});

angular.module('EditPage.checkboxinput',[]).directive('checkboxinput',function(){
	return{
		restrict:'AE',
		scope:{
			displayname:'@',
			inputcontent:'='
		},
		templateUrl:'checkboxinputtemplate',
		replace:true
	};
});

angular.module('EditPage.singleselectinput',['ui.bootstrap','ui.select2']).directive('singleselectinput',function(){
	return{
		restrict:'AE',
		scope:{
			displayname:'@',
			inputcontent:'=',
			options:'='		
		},
		templateUrl:'singleselectinputtemplate',
		replace:true
	};
});

angular.module('EditPage.multipleselectinput',['ui.bootstrap','ui.select2']).directive('multipleselectinput',function(){
	return{
		restrict:'AE',
		scope:{
			displayname:'@',
			inputcontent:'=',
			options:'='		
		},
		templateUrl:'multipleselecttemplate',
		replace:true
	};
});


angular.module('EditPage.datepickerinput',['ui.bootstrap']).directive('datepickerinput',function(){
	return{
		restrict:'AE',
		scope:{
			displayname:'@',
			inputcontent:'='	
		},
		templateUrl:'datepickerinputtemplate',
		replace:true,
		link:function(scope,element,attr){
			scope.open = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    scope.opened = true;
			};
			scope.dateOptions = {
    			formatYear: 'yy',
    			startingDay: 1
  			};

  		scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  		scope.format = scope.formats[1];
		}
	}
});

angular.module('EditPage.forminput',['EditPage.tpl','EditPage.commoninput','EditPage.checkboxinput','EditPage.singleselectinput','EditPage.multipleselectinput','EditPage.datepickerinput','DataSourceCache'])
	.directive('forminput',['$compile','$cacheFactory',function($compile,$cacheFactory){
		var forminput = {
			compile:function(){
				return{
					post: function(scope,iElement,attr) {
						var ConfigCache = $cacheFactory.get('DataSourceCache');
						var columnDefs= scope.columnDefs;
					    var template={
					    	'stringinput':'<commoninput type="text" displayname="{displayname}" placeholder="{placeholder}" inputcontent="epData.{field}"></commoninput>',
					    	'passwordinput':'<commoninput type="password" displayname="{displayname}" placeholder="{placeholder}" inputcontent="epData.{field}"></commoninput>',
					    	'emailinput':'<commoninput type="email" displayname="{displayname}" placeholder="{placeholder}" inputcontent="epData.{field}"></commoninput>',
					    	'numberinput':'<commoninput type="number" displayname="{displayname}" placeholder="{placeholder}" inputcontent="epData.{field}"></commoninput>',
					    	'textareainput':'<textareainput displayname="{displayname}" placeholder="{placeholder}" inputcontent="epData.{field}"></textareainput>',
					    	'checkboxinput':'<checkboxinput displayname="{displayname}" inputcontent="epData.{field}"></checkboxinput>',
					    	'singleselectinput':'<singleselectinput displayname="{displayname}" inputcontent="epData.{field}" options="{options}"></singleselectinput>',
					    	'multipleselectinput':'<multipleselectinput displayname="{displayname}" options="{options}" inputcontent="epData.{field}"></multipleselectinput>',
					    	'datepickerinput':'<datepickerinput displayname="{displayname}" inputcontent="epData.{field}"></datepickerinput>'
					    };
						var html=[] ;
						html.push('<div class="form-horizontal">\n');
						angular.forEach(columnDefs,function(d){
							if(d.hasOwnProperty('options')){
								if(typeof(d.options)!=='object'){
									d.options=ConfigCache.get(d.options);	
								}
							}
							var parthtml=template[d.controltype];
							parthtml=parthtml.format(d);
							html.push(parthtml+'\n');
						});
						html.push('</div>');
						html=html.join('');
						var cellElement = $(html);
                    	iElement.append(cellElement);
                    	$compile(cellElement)(scope);
                	}
				}
			}
		};	
		return forminput;
	}]);



angular.module("EditPage.commoninputtemplate", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("commoninputtemplate",
  	'<div class=\"form-group\">\n'+
			'<label for=\"\" class=\"col-md-2 control-label\">{{displayname}}</label>\n'+
			'<div class=\"col-md-10\">\n'+
				'<input type=\"{{type}}\" ng-model=\"inputcontent\" class=\"form-control\" placeholder=\"{{placeholder}}\">\n'+
			'</div>\n'+
		'</div>'
    );
}]);

angular.module("EditPage.textareainputtemplate", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("textareainputtemplate",
  	'<div class=\"form-group\">\n'+
			'<label for=\"\" class=\"col-md-2 control-label\">{{displayname}}</label>\n'+
			'<div class=\"col-md-10\">\n'+
				'<textarea ng-model=\"inputcontent\" class=\"form-control\" placeholder=\"{{placeholder}}\"></textarea>\n'+
			'</div>\n'+
		'</div>'
    );
}]);

angular.module("EditPage.checkboxinputtemplate", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("checkboxinputtemplate",
  	'<div class=\"form-group\">\n'+
			'<label for=\"\" class=\"col-md-2 control-label\">{{displayname}}</label>\n'+
			'<div class=\"col-md-1\">\n'+
				'<div class="checkbox text-center">\n'+				
					'<input type="checkbox" ng-model="inputcontent">\n'+			
				'</div>\n'+
			'</div>\n'+
		'</div>'
    );
}]);

angular.module("EditPage.singleselectinputtemplate", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("singleselectinputtemplate",
  	'<div class="form-group">\n'+
			'<label class="col-md-2 control-label">{{displayname}}</label>\n'+
			'<div class="col-md-10">\n'+
				'<select ui-select2 style="width:200px" ng-model="inputcontent" data-placeholder="{{displayname}}" ng-required="true">\n'+
					'<option ng-repeat="option in options" value="{{option.value}}">{{option.name}}</option>\n'+
				'</select>\n'+
			'</div>\n'+
		'</div>'
    );
}]);

angular.module("EditPage.multipleselecttemplate", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("multipleselecttemplate",
  	'<div class="form-group">\n'+
			'<label for="" class="col-md-2 control-label">{{displayname}}</label>\n'+
			'<div class="col-md-10">\n'+
				'<input type="hidden" style="width:400px" ui-select2="options" ng-model="inputcontent">\n'+
			'</div>\n'+
		'</div>'
    );
}]);


angular.module("EditPage.datepickerinputtemplate", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("datepickerinputtemplate",
  	'<div class="form-group">\n'+
			'<label for="" class="col-md-2 control-label">{{displayname}}</label>\n'+
			'<div class="col-md-6">\n'+
	            '<p class="input-group">\n'+
	              '<input type="text" class="form-control" datepicker-popup="{{format}}" ng-model="inputcontent" is-open="opened" min-date="minDate" max-date="\'2015-06-22\'" datepicker-options="dateOptions" date-disabled="disabled(date, mode)" ng-required="true" close-text="Close" />\n'+
	              '<span class="input-group-btn">\n'+
	                '<button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>\n'+
	              '</span>\n'+
	            '</p>\n'+
	        '</div>\n'+
		'</div>'
    );
}]);


// EditPage.directive('formtinput',function(){
// 	return{
// 		restrict:'AE',
// 		scope:{
// 			displayname:'@',
// 			inputcontent:'=',
// 			options:'='		
// 		},
// 		template:
// 		'<div class="form-horizontal">\n'+
// 		'</div>',
// 		replace:true
// 	}
// });
