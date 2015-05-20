var fs = require('fs');
var fsPath = require('fs-path');


var detailPartHtml = {
	text:'<div class="form-group">\n'+
				'<label for="" class="col-md-2 control-label">##displayName##</label>\n'+
				'<div class="col-md-10">\n'+
					'<input type="text" ##detailVerificate## ng-model="epData.##name##" class="form-control" placeholder="">\n'+
				'</div>\n'+
			'</div>\n',
	password:'<div class="form-group">\n'+
				'<label for="" class="col-md-2 control-label">##displayName##</label>\n'+
				'<div class="col-md-10">\n'+
					'<input type="password" ##detailVerificate## ng-model="epData.##name##" class="form-control" placeholder="">\n'+
				'</div>\n'+
			'</div>\n',
	email:'<div class="form-group">\n'+
				'<label for="" class="col-md-2 control-label">##displayName##</label>\n'+
				'<div class="col-md-10">\n'+
					'<input type="email" ##detailVerificate## ng-model="epData.##name##" class="form-control" placeholder="">\n'+
				'</div>\n'+
			'</div>\n',
	radio:'<div class="form-group">\n'+
				'<label class="col-md-2 control-label">##displayName##</label>\n'+
				'<div class="col-md-10">\n'+
					'<select ui-select2 style="width:200px" ng-model="epData.##name##" data-placeholder="##displayName##" ng-required="true">\n'+
						'<option ng-repeat="option in roleOptions" value="{{option.value}}">{{option.name}}</option>\n'+
					'</select>\n'+
				'</div>\n'+
			'</div>\n',
	multiple:'<div class="form-group">\n'+
				'<label for="" class="col-md-2 control-label">##displayName##</label>\n'+
				'<div class="col-md-10">\n'+
					'<input type="hidden" style="width:400px" ui-select2="multipleDataSource" ng-model="epData.##name##">\n'+
				'</div>\n'+
			'</div>',
	textarea:'<div class="form-group">\n'+
				'<label for="" class="col-md-2 control-label">备注</label>\n'+
				'<div class="col-md-10">\n'+
					'<textarea ng-model="epData.##name##" class="form-control" placeholder=""></textarea>]n'+
				'</div>\n'+
			'</div>',
	datepicker:'<div class="form-group">\n'+
			'<label for="" class="col-md-2 control-label">{{displayname}}</label>\n'+
			'<div class="col-md-6">\n'+
	            '<p class="input-group">\n'+
	              '<input type="text" class="form-control" datepicker-popup="{{format}}" ng-model="epData.##name##" is-open="opened" min-date="minDate" max-date="\'2015-06-22\'" datepicker-options="dateOptions" date-disabled="disabled(date, mode)" ng-required="true" close-text="Close" />\n'+
	              '<span class="input-group-btn">\n'+
	                '<button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>\n'+
	              '</span>\n'+
	            '</p>\n'+
	        '</div>\n'+
		'</div>'
	ueditor:'<div class="form-group">\n'+
				'<label for="" class="col-md-2 control-label">{{displayname}}</label>\n'+
				'<div class="col-md-10">\n'+
					'<ueditor ng-model="epData.##name##"></ueditor>\n'+
				'</div>\n'+
			'</div>'
	}

//网站分类表
var tempData_WebSort={
	tableName:'webSort',
	exposeValue:['tableName','defaultField','extendField','listColumnConf','viewColumnConf','detailHtml'],
	listColumnConf:function(){
		var ColumnConf = [];
		var field = this.field;
		for(var i = 0 ; i < field.length;i++){
			var fieldOne = field[i];
			ColumnConf.push(fieldOne.listColumnConf+',');
		}
		return ColumnConf.join('\r\n\t');
	},
	detailHtml:function(){
		var detailHtmlAdd=[];
		var field = this.field;
		for(var i = 0 ; i <field.length;i++){		
			var fieldOne = field[i];
			var html = detailPartHtml[fieldOne.inputType];
			for(var i in fieldOne.exposeValue){
				var exposeValueOne = fieldOne.exposeValue[i];
				var reg = new RegExp('##'+exposeValueOne+'##','gi'); 
				switch(typeof(fieldOne[exposeValueOne])){
					case 'string':
						html=html.replace(reg,fieldOne[exposeValueOne]);
						break;
					case 'function':
						html=html.replace(reg,fieldOne[exposeValueOne]());
						break;
					default:break;
					}
				}
				//console.log(html);
				detailHtmlAdd.push(html);
			}
			return detailHtmlAdd.join('\n');
		},
	viewColumnConf:function(){
		var ColumnConf = [];
		var field = this.field;
		for(var i = 0 ; i < field.length;i++){
			var fieldOne = field[i];
			ColumnConf.push(fieldOne.listColumnConf+',');
			
		}
		return ColumnConf.join('\r\n\t');
	},
	extendField:function(){
		var changToSchema=[];
		var field = this.field;
		for(var i = 0 ; i <field.length;i++){		
			var fieldOne = field[i];
			changToSchema.push(fieldOne.fieldSchema+',');
		}
		return changToSchema.join('\r\n\t');
	},
	defaultField:fs.readFileSync('defaultField.js','utf-8'),
	field:[{
		exposeValue:['name','displayName','detailVerificate'],
		fieldSchema:'TheName:String',
		name:'TheName',
		displayName:'网站分类名称',
		detailVerificate:'required',
		listColumnConf:'{field: \'TheName\',displayName: \'网站分类名称\'}',
		inputType:'text'
	}]
};

//var path = 'tempModel.js';

var outputTemp = function(tempPath,tempData,outputPath){
	var mode = 'utf-8';
	var outputPathInner = outputPath;
	fs.readFile(tempPath, mode, function(err,data){
		if(err) throw err;
		var outputData = data;
		var exposeValue = tempData.exposeValue
		for(var i in exposeValue){
			var reg = new RegExp('##'+exposeValue[i]+'##','gi'); 
			switch(typeof(tempData[exposeValue[i]])){
				case 'string':
					outputData=outputData.replace(reg,tempData[exposeValue[i]]);
					break;
				case 'function':
					outputData=outputData.replace(reg,tempData[exposeValue[i]]());
					break;
				default:break;
			}
		}
		fsPath.writeFile(outputPathInner, outputData, mode, function(err){
			if(err) throw err;
			console.log('save');
		});
	})
}

outputTemp('tempModel.js',tempData_WebSort,'../route/Models/webSort.js');
outputTemp('tempRoute.js',tempData_WebSort,'../route/webSort.js');
outputTemp('tempController.js',tempData_WebSort,'temp/a/Controller.js');
outputTemp('tempList.js',tempData_WebSort,'temp/a/list.html');
outputTemp('tempView.js',tempData_WebSort,'temp/view.html');
outputTemp('tempDetail.js',tempData_WebSort,'temp/detail.html');
outputTemp('tempRouteConf.js',tempData_WebSort,'temp/RouteConf.js');