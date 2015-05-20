
var mongoose = require('mongoose');

var webSortSchema = new mongoose.Schema({
	TheName:String,
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


webSortSchema.pre('save',function(next,userId){
	if(this.isNew){
		this.meta.createUser = this.meta.updateUser = userId;
		this.meta.createAt= this.meta.updateAt=Date.now();
	}else{
		this.meta.updateUser = userId;
		this.meta.updateAt=Date.now();
	}
	next()
});


webSortSchema.statics ={
	fetch:function(cb){
		this.find({},cb).sort('meta.updateAt');
	},
	findById:function(id, cb){
		return this.findOne({_id:id},cb);
	}
}

var webSort = mongoose.model('webSorts',webSortSchema);

module.exports = webSort;