
var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
	TheName:String,
	Power:Array,
	IsUse:{
		type:Boolean,
		defualt:true
	},
	IsDelete:{
		type:Boolean,
		defualt:false
	},
	Remark:String,
	meta:{
		createAt:{
			type:Date,
			defualt:Date.now()
		},
		updateAt:{
			type:Date,
			defualt:Date.now()
		},
		createUser:{
			type:mongoose.Schema.Types.ObjectId,ref:'users'
		},
		updateUser:{
			type:mongoose.Schema.Types.ObjectId,ref:'users'
		}
	}
});


roleSchema.pre('save',function(next,userId){
	if(this.isNew){
		this.meta.createUser = this.meta.updateUser = userId;
		this.meta.createAt= this.meta.updateAt=Date.now();
	}else{
		this.meta.updateUser = userId;
		this.meta.updateAt=Date.now();
	}
	next()
});


roleSchema.statics ={
	fetch:function(cb){
		this.find({},cb).sort('meta.updateAt');
	},
	findById:function(id, cb){
		return this.findOne({_id:id},cb);
	}
}

var role = mongoose.model('roles',roleSchema);

module.exports = role;