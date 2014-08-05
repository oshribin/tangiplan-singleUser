var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new Schema({
			name: String,
			givDuration: Number,
			exDuration:Number,
			objectId:Number,
			lastDate:Date,
			checked:Boolean,
			disable:Boolean
});

module.exports = mongoose.model("task",taskSchema);

