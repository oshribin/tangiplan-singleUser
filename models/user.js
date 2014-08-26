var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
			name: String,
			wakeUp: String,
			goOut: String,

});

module.exports = mongoose.model("user",userSchema);

