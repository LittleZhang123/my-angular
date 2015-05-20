
var mongoose = require('mongoose');

var ##tableName##Schema = new mongoose.Schema({
	##extendField##
	##defaultField##
});


##tableName##Schema.pre('save',function(next,userId){
	if(this.isNew){
		this.meta.createUser = this.meta.updateUser = userId;
		this.meta.createAt= this.meta.updateAt=Date.now();
	}else{
		this.meta.updateUser = userId;
		this.meta.updateAt=Date.now();
	}
	next()
});


##tableName##Schema.statics ={
	fetch:function(cb){
		this.find({},cb).sort('meta.updateAt');
	},
	findById:function(id, cb){
		return this.findOne({_id:id},cb);
	}
}

var ##tableName## = mongoose.model('##tableName##s',##tableName##Schema);

module.exports = ##tableName##;