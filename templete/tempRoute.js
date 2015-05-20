
var Model = require('./Models/##tableName##');
var _ = require('underscore')



//登陆
/*
	POST localhost:3000/##tableName##/signup
	Content-type: application/x-www-form-urlencoded
	POST_BODY:
	##tableName##={IsUse: true,
		Password: "1111",
		RealName: "1111",
		Remark: "111",
		Model: "commonadmin",
		TheName: "zhangdage2",
		_Id: "2"
		}
*/

//base function
// localhost:3000/##tableName##
exports.list = function (req,res) {
	Model.fetch(function(err,##tableName##){
		if(err){
			return res.send(err);
		}
		return res.send(##tableName##);
	})
	// console.log(module.filename);
	 
}
//查找一条数据
exports.findOne = function(req,res) {
	//var _id = req.query['id']  /get ?id=****
	var _id = req.param('id')    // /:id
	console.log(_id)
	Model.findById(_id,function(err,##tableName##){
		if(err){
			return res.send(err)
		}
		return res.send(##tableName##)
	})
}

exports.add =function  (req,res) {

	var userId = req.session.user._id;
	
	var _##tableName## = req.body.##tableName##;   // post 
	var _id = _##tableName##._id
	if(_id){
		Model.findById(_id,function(err,##tableName##){
			if(err){
				console.log(err)
				return res.send({isSuccess:false,cause:err});

			}
			var __##tableName## = _.extend(##tableName##,_##tableName##)
			__##tableName##.save(userId,function(err,##tableName##){
				if(err){
					console.log(err)
					return res.send({isSuccess:false,cause:err});
					
				}
				return res.send({isSuccess:true});
			})
		})

	}else{
		var ##tableName##Model =  new Model(_##tableName##);
 		##tableName##Model.save(userId,function(err,##tableName##){
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
		Model.remove({_id:_id},function(err,##tableName##){
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