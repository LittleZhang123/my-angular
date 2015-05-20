<form class="panel panel-primary showcase-form" name="form">
	<div class="panel-heading">
		<button ng-click="submit()" ng-disabled="form.$invalid" class="btn btn-success">保存</button>
		<a ui-sref="##tableName##List()" class="btn btn-default">返回</a>
	</div>	
	<div class="panel-body" style="overflow:auto;max-height:500px;">
		<div class="form-horizontal">
			##detailHtml##
			<div class="form-group">
				<label for="" class="col-md-2 control-label">是否启用</label>
				<div class="col-md-1">
					<div class="checkbox text-center">
						<input type="checkbox" ng-model="epData.IsUse">
					</div>
				</div>
			</div>
			<div class="form-group">
				<label for="" class="col-md-2 control-label">是否删除</label>
				<div class="col-md-1">
					<div class="checkbox text-center">
						<input type="checkbox" ng-model="epData.IsDelete">
					</div>
				</div>
			</div>
			<div class="form-group">
				<label for="" class="col-md-2 control-label">备注</label>
				<div class="col-md-10">
					<textarea ng-model="epData.Remark" class="form-control" placeholder=""></textarea>
				</div>
			</div>
		</div>
	</div>
</form>
