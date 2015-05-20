var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR=10

var UserSchema = new mongoose.Schema({
	TheName:{type:String,unique:true},
	Password:String,
	Role:{type:mongoose.Schema.Types.ObjectId,ref:'roles'},
	RealName:String,
	IsUse:Boolean,
	IsDelete:Boolean,
	Remark:String,
	meta:{
		createAt:{
			type:Date,
			defualt:Date.now()
		},
		updateAt:{
			type:Date,
			defualt:Date.now()
		}
	}
});


UserSchema.pre('save',function(next){

	var user=this;
	if(this.isNew){
		this.meta.createAt= this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR,function  (err,salt) {
		if(err){
			return next(err);
		} 
	
		bcrypt.hash(user.Password,salt,'',function(err,hash){
			if(err){
				return next(err);
			} 
			user.Password = hash;
			next();
		})
	})
});

UserSchema.methods = {
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.Password,function(err,isMatch){
			if(err){
				return cb(err)
			}
			cb(null,isMatch)
		})
	}
}

UserSchema.statics ={
	fetch:function(cb){
		this.find({},cb).sort('meta.updateAt');
	},
	findById:function(id, cb){
		return this.findOne({_id:id},cb);
	}
}

var User = mongoose.model('users',UserSchema);

module.exports = User;