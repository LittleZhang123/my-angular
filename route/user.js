
var User = require('./Models/user');

var _ = require('underscore')



//登陆
/*
	POST localhost:3000/user/signup
	Content-type: application/x-www-form-urlencoded
	POST_BODY:
	user={IsUse: true,
		Password: "1111",
		RealName: "1111",
		Remark: "111",
		Role: "commonadmin",
		TheName: "zhangdage2",
		_Id: "2"
		}
*/

//base function

// localhost:3000/user
exports.list = function (req,res) {
	User.fetch(function(err,user){
		if(err){
			return res.send(err);
		}
		return res.send(user);
	})
	// console.log(module.filename);
	 
}
//查找一条数据
exports.findOne = function(req,res) {
	console.log(req.route)
	console.log(req.path)
	//var _id = req.query['id']  /get ?id=****
	var _id = req.param('id')    // /:id
	console.log(_id)
	User.findById(_id,function(err,user){
		if(err){
			return res.send(err)
		}
		return res.send(user)
	})
}



exports.add =function  (req,res) {
	var _user = req.body.user;   // post 
	var _id = _user._id
	if (req.poster) {
	    movieObj.poster = req.poster
	}

	if(_id){
		User.findById(_id,function(err,user){
			if(err){
				console.log(err)
				return res.send({isSuccess:false,cause:err});

			}
			var __user = _.extend(user,_user)
			__user.save(function(err,user){
				if(err){
					console.log(err)
					return res.send({isSuccess:false,cause:err});
					
				}
				return res.send({isSuccess:true});
			})
		})

	}else{
		User.findOne({TheName:_user.TheName},function(err,user){
			console.log(user)
			if(err){
				console.log(err)
				return res.send({isSuccess:false,cause:err});
				
			}
			console.log(user)
			if(user){
				return res.send({isSuccess:false,cause:'已经该用户存在'});
			}
			var userModel =  new User(_user);
	 		userModel.save(function(err,user){
				if(err){
					console.log(err)
					return res.send({isSuccess:false,cause:err});
					
				}
				return res.send({isSuccess:true});
			})
		})	
	}
}

exports.deleteOne = function(req,res){
	var _id = req.param('id')
	console.log(_id)
	if(_id){
		User.remove({_id:_id},function(err,user){
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

//登陆
exports.signin = function(req,res) {
	var _user =req.body.user
	var name= _user.TheName
	var password = _user.Password
	User.findOne({TheName:name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.send({isPass:false,cause:'exsit the user'});
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				req.session.user = user

				return res.send({isPass:true})
			}else{
				return res.send({isPass:false,cause:'password is not match'})
			}
		})
	})
	
}

exports.signUp = function(req,res){
	delete req.session.user
	if(!req.session.user){
		return res.send({isSuccess:true})
	}else{
		return res.send({isSuccess:false})
	}
}

// localhost:3000/user/isSignIn
exports.isSignIn = function(req,res){
	if(exports.__isExsitUserSession(req)){
		return res.send({isSignIn:true,user:req.session.user})
	}else{
		return res.send({isSignIn:false})
	}
}

exports.__isExsitUserSession =function(req){
	if(req.session.user){
		return true;
	}
	return false;
}

//extend function



// exports.delete('user/deleteList',function(req,res){
// 	var _ids = req.body._ids
// 	var deleteCount=0
// 	for(var i in _ids){
// 		User.remove({_id:_ids[i]},function(err,user){
// 			if(!err){
// 				deleteCount++
// 			}
// 		})
// 	}
// })