
var Role = require('./Models/role');
var _ = require('underscore')



//登陆
/*
	POST localhost:3000/role/signup
	Content-type: application/x-www-form-urlencoded
	POST_BODY:
	role={IsUse: true,
		Password: "1111",
		RealName: "1111",
		Remark: "111",
		Role: "commonadmin",
		TheName: "zhangdage2",
		_Id: "2"
		}
*/

//base function
// localhost:3000/role
exports.list = function (req,res) {
	Role.fetch(function(err,role){
		if(err){
			return res.send(err);
		}
		return res.send(role);
	})
	// console.log(module.filename);
	 
}
//查找一条数据
exports.findOne = function(req,res) {
	//var _id = req.query['id']  /get ?id=****
	var _id = req.param('id')    // /:id
	console.log(_id)
	Role.findById(_id,function(err,role){
		if(err){
			return res.send(err)
		}
		return res.send(role)
	})
}

exports.add =function  (req,res) {

	var userId = req.session.user._id;
	
	var _role = req.body.role;   // post 
	var _id = _role._id
	// if (req.poster) {
	//     movieObj.poster = req.poster
	// }
	if(_id){
		Role.findById(_id,function(err,role){
			if(err){
				console.log(err)
				return res.send({isSuccess:false,cause:err});

			}
			var __role = _.extend(role,_role)
			__role.save(userId,function(err,role){
				if(err){
					console.log(err)
					return res.send({isSuccess:false,cause:err});
					
				}
				return res.send({isSuccess:true});
			})
		})

	}else{
		var roleModel =  new Role(_role);
 		roleModel.save(userId,function(err,role){
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
		Role.remove({_id:_id},function(err,role){
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

 function _contains(array,val){ 
	for(var i=0; i<array.length; i++){ 
		if(array[i] == val) 
			return true; 
	} 
	return false; 
}

exports.checkPower = function(roleId,url,cb){
	Role.findById(roleId,function(err,role){
		if(err){
			console.log(err);
			return cb(false,err);
		}
		if(!role){
			return cb(false);
		}
		var isExsitUrl=_contains(role.Power,url);
		if(!isExsitUrl){
			return cb(false);
		}
		return cb(true);
	})
}

//extend function