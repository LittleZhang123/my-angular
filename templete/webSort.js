var Model = require('./Models/webSort');
var _ = require('underscore')



//登陆
/*
	POST localhost:3000/webSort/signup
	Content-type: application/x-www-form-urlencoded
	POST_BODY:
	webSort={IsUse: true,
		Password: "1111",
		RealName: "1111",
		Remark: "111",
		Model: "commonadmin",
		TheName: "zhangdage2",
		_Id: "2"
		}
*/

//base function
// localhost:3000/webSort
exports.list = function (req,res) {
	Model.fetch(function(err,webSort){
		if(err){
			return res.send(err);
		}
		return res.send(webSort);
	})
	// console.log(module.filename);
	 
}
//查找一条数据
exports.findOne = function(req,res) {
	//var _id = req.query['id']  /get ?id=****
	var _id = req.param('id')    // /:id
	console.log(_id)
	Model.findById(_id,function(err,webSort){
		if(err){
			return res.send(err)
		}
		return res.send(webSort)
	})
}

exports.add =function  (req,res) {

	var userId = req.session.user._id;
	
	var _webSort = req.body.webSort;   // post 
	var _id = _webSort._id
	if(_id){
		Model.findById(_id,function(err,webSort){
			if(err){
				console.log(err)
				return res.send({isSuccess:false,cause:err});

			}
			var __webSort = _.extend(webSort,_webSort)
			__webSort.save(userId,function(err,webSort){
				if(err){
					console.log(err)
					return res.send({isSuccess:false,cause:err});
					
				}
				return res.send({isSuccess:true});
			})
		})

	}else{
		var webSortModel =  new Model(_webSort);
 		webSortModel.save(userId,function(err,webSort){
			if(err){
				console.log(err)
				return res.send({isSuccess:false,cause:err});
				
			}
			return res.send({isSuccess:true});
		})
	}
}

exports.deleteOne = function(req,res){
	var _id = req.param('id')
	console.log(_id)
	if(_id){
		Model.remove({_id:_id},function(err,webSort){
			if(err){
				return res.send({isSuccess:false,cause:err})
			}else{
				return res.send({isSuccess:true})
			}
		})
	}
}

//base function

//extend function
//extend function