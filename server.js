var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Task = require("./models/task");
var Log = require("./models/log");
var csv = require("csv");
var User = require("./models/user");
//var hash = require("./pass").hash;
//var session = require("express-sesssion");

mongoose.connect("mongodb://localhost:27017/test");

app.use(bodyParser());
/*app.use(session({
	resave: false,
	saveUninitializied:false,
	secret: "secret"
}));

app.use(function(req, res, next){
	var err = req.session.error;
	var msg = req.session.success;
	delete req.session.error;
	delete req.session.success;
	res.locals.message = "";
	if(err) res.locals.message = "<p class = 'msg error'>" + err + "</p>";
	if(msg) res.locals.message = "<p class = 'msg success'>" + msg + "</p>";
	next();
});*/


var router = express.Router();

router.get("/", function(req, res) {
	res.sendfile("index.html");
	
});


router.use("/public", express.static("public"));

/*router.route("/users")

	.post(function(req,res){
		hash(req.body.pass, function(err,salt,hash){
		if(err)
			console.log(err);
		var user = new User({
			name: req.body.name,
			salt: salt,
			hash: hash,
		});

		user.save(function(err){
			if(err)
				console.log(err);
			
		})


	})*/

router.route("/users")

	.post(function(req,res){
		var user = new User({
			name: req.body.name,
		});

		user.save(function(err){
			if(err)
				res.send(err);
			res.json(user);
		});
	})


		.get(function(req, res){
			User.find(function(err, users){
				if(err)
					res.send(err);
				res.json(users);
			});
		});


router.route("/users/:user_id")

	.get(function(req, res){
		User.findById(req.params.user_id, function(err, user){
			if(err)
				res.send(err);
			res.json(user);

		});
	})

	.put(function(req, res){
		User.findById(req.params.user_id, function(err, user){
			if(err)
				res.send(err);
			user.wakeUp = req.body.wakeUp;
			user.goOut = req.body.goOut;
			user.save(function(err, user){
				if(err)
					res.send(err);
				console.log(user);
				res.json(user);
			});
		});
	});


router.route("/tasks")

	.post(function(req,res){
		console.log(req.body);
		var task = new Task({
			name:req.body.name,
			givDuration:req.body.givDuration,
			objectId:req.body.objectId,
			userid:req.body.userid,

		});

		task.save(function(err){
			if(err)
				res.send(err);
			console.log(task);
			 res.json(task);
		});	 
	})

	.get(function(req, res){
		Task.find(function(err, tasks){
			if(err)
				res.send(err);
			res.json(tasks);
		});
	});	


router.route("/getDuration/:object_id")

	.get(function(req, res){
		Task.findOne({objectId:req.params.object_id}, function(err, task){
			if(err)
				res.send(err);
			else if(task)
				res.send(task.objectId+":"+parsMill(task.givDuration));
			else
			  res.send("there is not task that match this id");
		});
	});

router.route("/setDuration/:object_id/:ex_duration/:flag")

	.get(function(req, res){
		Task.findOne({objectId:req.params.object_id}, function(err, task){
			if(err)
				res.send(err)
			else if(task){
				var _parsDuration = parsMill(task.givDuration);
				var _millexception = _parsDuration - req.params.ex_duration;
				var objectId = task.objectId;

				task.exDuration = parseVal(req.params.ex_duration);
				task.exception = parseVal(_millexception);
				task.endedByUser = req.params.flag == true ? true : false;
				task.overexcep = Math.abs(_millexception) > (0.2*_parsDuration);
				task.lastDate = Date.now() + 10800000//timestamp;
				task.objectId = null;
				task.save(function(err, task){
					
					if(err)
						res.send(err);
					else if(task){
						var log = new Log(task);
						console.log(log);	
						User.findOne({_id:task.userid}, function(err, user){
							
							if(err)
								res.send(err)
							else if(user){
								log.objectId = objectId;
								log.wakeUp = user.wakeUp;
								log.goOut = user.goOut;
								log.date = getYMD(task.lastDate);
								log.endTime = getHMS(task.lastDate);
								log.startTime = calcTime(task.lastDate, task.exDuration);
								log.save(function(err,log){
									if(err)
										res.send(err);
									res.send("task end");
								});
							}
							else
								res.send("task end no user detected");
						});	
					}	
				});
			}
			else
				res.send("there is not task that match this id");	
		});
	});

	

router.route("/tasks/:task_id")

	.get(function(req, res){
		Task.findById(req.params.task_id, function(err, task){
			if(err)
				res.send(err);
			res.json(task);
		});

	})
	
	.put(function(req, res){
		Task.findById(req.params.task_id, function(err, task){
			if(err)
				res.send(err)
			
			task.name = req.body.name;
			task.givDuration = req.body.givDuration;
			task.exDuration = req.body.exDuration;
			task.objectId = req.body.objectId;
			task.lastDate = req.body.lastDate;
			task.checked = req.body.checked;
			task.disable = req.body.disable;
			task.exception = req.body.exception;
			task.endedByUser = req.body.endedByUser;
			task.overexcep = req.body.overexcep;
			task.lastDate = req.body.lastDate;
			task.userid = req.body.userid;
			
			task.save(function(err,task){
				if(err)
					res.send(err);
	 			res.json(task);
			});
		});
	})

	.delete(function(req, res){
		Task.remove({
			_id: req.params.task_id
		}, function(err, task){
			if(err)
				res.send(err)
			res.json({message:task+"removed successfully"});
		});
		
	});

	parsMill = function(duration){
		var m = /*duration.charAt(1)==":" ? 0 :*/ parseInt(duration.substring(0,2));
		var s = /*m==0 ? parseInt(duration.substring(2,4)) :*/ parseInt(duration.substring(3,5));
		return((m*60000)+(s*1000));
	}

	parseVal = function(duration){
		var absDuration = Math.abs(duration);
		var m = Math.floor(absDuration/60000);
		var s = Math.floor((absDuration%60000)/1000);
		if(s<10)
			s="0"+s;
		if (m<10)
			m="0"+m;
		var str = duration < 0 ?  "-"+m+":"+s : m+":"+s;		
			return str;	
	}

	getYMD = function(dt){
		return dt.getDate() + "/" + (dt.getMonth()+1) + "/" + (dt.getFullYear()); 
	}

	getHMS = function(dt){
		console.log(dt.getTime());
		return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
	}

	calcTime = function(dt, ex){
		var sturtDate = new Date(dt.getTime()-parsMill(ex));
		return(getHMS(sturtDate));
	}




app.use("/TangiPlan", router);
app.listen("80");
console.log("walla");
