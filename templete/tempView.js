<div class="panel panel-primary">
	<div class="panel-heading">
		<a ui-sref="##tableName##List()" class="btn btn-default">返回</a>
	</div>
	<div class="panel-body">
		<table class="table table-bordered">
			<tr class="row">
				<td class="col-md-12" colspan="2" style="text-align:center">{{table.head}}</td>
			</tr>
			<tr class="row" ng-repeat="tr in table.content">
				<td class="col-md-6 text-right">{{tr.displayName}}</td>
				<td class="col-md-6 text-left"><p class="table-limit-width">{{tr.value}}</p></td>
			</tr>
		</table>
	</div>
</div>