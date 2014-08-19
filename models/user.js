var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
			name: String,
			wakeUp: Number,
			goOut: Number,
			salt: String,
			hash: String,
});

module.exports = mongoose.model("user",userSchema);

