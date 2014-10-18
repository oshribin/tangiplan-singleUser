var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userLogSchema = new Schema({
			name:String,
			wakeUp:String,
			goOut:String,
			timeLeft:String,
			arangeTime:String,
			endToArange:String,
			clUsage:Number,
			actGoOut:Date,
});

module.exports = mongoose.model("userlog",userLogSchema);