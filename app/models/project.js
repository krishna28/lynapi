var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var expertStatus = require('./expertstatus');

var projectStatusEnum = ['NEW','PENDING']

var projectSchema = new Schema({
	creator : {type:Schema.Types.ObjectId,ref:'User'},
    title : String,
    created : {type:Date,default:Date.now},
    status:{
    	type:String,
    	enum:projectStatusEnum
    },
    experts:[expertStatus]
});

module.exports = mongoose.model('Project',projectSchema);