var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new Schema({
			name: String,
			givDuration: String,
			exDuration:String,
			objectId:Number,
			lastDate:Date,
			checked:Boolean,
			disable:Boolean,
			exception:String,
			endedByUser:Boolean,
			overexcep: Boolean,
});

module.exports = mongoose.model("task",taskSchema);

