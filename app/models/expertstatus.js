var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var status = ['APPROVED','REJECTED','PENDING'];
var expertStatus = Schema({
	expert:{type:Schema.Types.ObjectId,ref:'User'},
	status:{
		type:String,
		enum:status
	}
})

module.exports = expertStatus;