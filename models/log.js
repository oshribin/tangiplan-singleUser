var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var logSchema = new Schema({
			name: String,
			givDuration: String,
			exDuration:String,
			objectId:Number,
			lastDate:Date,
			exception:String,
			endedByUser:Boolean,
			overexcep: Boolean,
			givFreeTime: String,
			exFreeTime: String,
			wakeUp: String,
			goOut: String,
			date: String,
			endTime: String,
			startTime:String,
});

module.exports = mongoose.model("log",logSchema);
