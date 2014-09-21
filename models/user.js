var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
			name: String,
			wakeUp: String,
			goOut: String,
			clUsage: Number,
			timeLeft:String,
			arangeTime:String,
			endToArange:String,

});

module.exports = mongoose.model("user",userSchema);

