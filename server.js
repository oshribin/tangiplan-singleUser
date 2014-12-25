var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var app = express();
var mongoose = require("mongoose");
var Task = require("./models/task"); 
var Log = require("./models/log");
var User = require("./models/user");
var UserLog = require("./models/userlog");
var _ = require("underscore");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var csv = require("fast-csv");
var fs = require("fs");


mongoose.connect("mongodb://localhost:27017/test");

app.use(bodyParser());
app.use(session({secret: "keyboard cat",  cookie:{maxAge:10*24*60*60*1000}}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


var router = express.Router();


router.get("/logfile", function(req, res){
	res.sendfile("mainlog.log");
});

router.get("/objectslogfile", function(req, res){
	res.sendfile("objectlog.log");
})




router.get("/download", function(req,res){
	Log.find(function(err, logs){
		if(err)
			res.send(err);
		else if(logs){	
			console.log(logs[0]);
			var csvStream = csv.format({headers: true, objectMode: true});
   			var writableStream = fs.createWriteStream("log.csv");
   				writableStream.on("finish", function(){
   					console.log("done");
  					res.download("log.csv");
				});
			csvStream.pipe(writable	Stream);
			logs.forEach(function(log){
				csvStream.write(log.toObject());
			});	
			csvStream.end();
		}
	});
});

router.get("/", function(req, res) {
	res.sendfile("index.html");
	console.log(req.session.passport.user);
});

app.get("/currentUser", function(req,res){
	if(req.session.passport.user){
		res.send(req.session.passport.user.name);
		 logger(req.session.passport.user.name + " have been connected successfully ");
	}


});

app.get("/logTomain/:message", function(req, res){
	var username = req.session.passport.user.name;
	var date = new Date(Date.now());
	logger(username+ " " + message + " " + date);
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  })
);
 
app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});
 
app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
  logger(req.session.passport.user.name + " have been connected successfully ");
});

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password,done){
	process.nextTick(function(){

		User.findOne({'name':username}, function(err,user){
			if(err){
				return done(err);
			}

			if(!user){
				return done(null,false);
			}
			if(user.pass != password){
				return done(null, false);
			}
			return done(null,user);
		});
	});
}));	




router.use("/public", express.static("public"));

router.get("/objectOn/:objectId/:timeStamp", function(req, res){
	objectlogger("object number " + req.params.objectId + " woke up at " + new Date(req.params.timeStamp*1000));
	console.log("object number " + req.params.objectId + " woke up at " + new Date(req.params.timeStamp*1000));
	console.log(req.params.timeStamp);

});

router.route("/users")

	.post(function(req,res){
		var user = new User({
			name: req.body.name,
			pass: req.body.pass,
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
			if(user){
				var lastGoOut = user.actGoOut;

				user.wakeUp = req.body.wakeUp;
				user.goOut = req.body.goOut;
				user.clUsage = req.body.clUsage;
				user.timeLeft = req.body.timeLeft;
				user.arangeTime = req.body.arangeTime;
				user.actGoOut = req.body.actGoOut;
				user.endToArange = req.body.endToArange;

				if(Date.parse(lastGoOut) !== Date.parse(user.actGoOut)){
					var userlog = new UserLog({
					name:user.name,
					wakeUp:req.body.wakeUp,
					goOut:req.body.goOut,
					timeLeft:req.body.timeLeft,
					arangeTime:req.body.arangeTime,
					endToArange:req.body.endToArange,
					clUsage:req.body.clUsage,
					actGoOut:req.body.actGoOut,
					});
					userlog.save(function(err, userlog){
						if(err)
							res.send(err);
					});
					user.clUsage = 0;
				}

				user.save(function(err,user){
					if(err)
						res.send(err)
					else if(user)
						res.json(user);
				});
			}
		});
	});


router.route("/tasks")

	.post(function(req,res){
		var task = new Task({
			name:req.body.name,
			givDuration:req.body.givDuration,
			objectId:req.body.objectId,
			userid:req.body.userid,
			set_id:req.body.set_id,

		});

		task.save(function(err){
			if(err)
				res.send(err);
			 res.json(task);
		});	 
	})

	.get(function(req, res){
		var id = req.session.passport.user._id;
		Task.find({userid:id},function(err, tasks){
			if(err)
				res.send(err);
			res.json(tasks);
		});
	});	


router.route("/getDuration/:object_id")
	
	.get(function(req, res){
		Task.findOne({objectId:req.params.object_id, set_id:req.params.set_id}, function(err, task){
			if(err){
				objectlogger("object number " + req.params.object_id + " asked for task and get error");
				res.send(err);
			}
			if(task && task.givDuration){
				res.send(task.objectId+":"+parsMill(task.givDuration));
				objectlogger("object number " + req.params.object_id + " asked for task and got " + task.name);
			}
			else{
				res.send("there is no task that match this id");
				objectlogger("object number " + req.params.object_id + " asked for task but there is no task for this object");
			}
		});
	});

router.route("/setDuration/:object_id/:ex_duration/:flag")

	.get(function(req, res){
		Task.findOne({objectId:req.params.object_id, set_id:req.params.set_id}, function(err, task){
			if(err){
				objectlogger("object number " + req.params.object_id + "try to closed the task and got error");
				res.send(err)
			}
			if(task){
				var _parsDuration = parsMill(task.givDuration);
				var _millexception = req.params.ex_duration - _parsDuration;
				var objectId = task.objectId;
				var lastDate = Date.now();

				task.exDuration = parseVal(req.params.ex_duration);
				task.exception = parseVal(_millexception);
				task.endedByUser = req.params.flag == true ? true : false;
				task.overexcep = _millexception > (0.2*_parsDuration);
				task.lastDate = lastDate;
				task.lastObjectId = objectId;
				task.objectId = null;
				task.save(function(err, task){
					
					if(err){
						objectlogger("object number " + req.params.object_id + "try to closed the task and got error");
						res.send(err);
					}

					else if(task){
						var log = new Log({
							name: task.name,
							givDuration: task.givDuration,
							exDuration: task.exDuration,
							lastDate: task.lastDate,
							exception: task.exception,
							endedByUser: task.endedByUser,
							overexcep: task.overexcep,
							givFreeTime: task.givFreeTime,
						});
						
						var prev = freeTime(task);
							

						User.findOne({_id:task.userid}, function(err, user){
							if(err)
								res.send(err)
							else if(user != null){
								log.objectId = objectId;
								log.wakeUp = user.wakeUp;
								log.goOut = user.goOut;
								log.date = getYMD(task.lastDate);
								log.endTime = getHMS(task.lastDate);
								log.startTime = calcTime(task.lastDate, task.exDuration);
								log.save(function(err,log){
									if(err){
										objectlogger("object number " + req.params.object_id + " try to closed the task and got error");
										res.send(err);
									}
									else {
									res.send("task end");
									objectlogger("object number " + req.params.object_id + " closed the task " + task.name);
								}
							});
							}
							else
								res.send("task end no user detected");
						});	
					}	
				});
			}
			else{
				objectlogger("object number " + req.params.object_id + " try to closed the task but ther is no task ");
				res.send("there is no task that match this id");	
			}
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
			else if(task){
				logger(req.session.passport.user.name + " update the task: " + task.name + " to object number: " + req.body.objectId);	
				task.name = req.body.name;
				task.givDuration = req.body.givDuration;
				task.exDuration = req.body.exDuration;
				task.objectId = req.body.objectId;
				task.lastObjectId = req.body.lastObjectId;
				task.lastDate = req.body.lastDate;
				task.checked = req.body.checked;
				task.disable = req.body.disable;
				task.exception = req.body.exception;
				task.endedByUser = req.body.endedByUser;
				task.overexcep = req.body.overexcep;
				task.lastDate = req.body.lastDate;
				task.userid = req.body.userid;
				task.exFreeTime = req.body.exFreeTime;
				task.givFreeTime = req.body.givFreeTime;

				
				task.save(function(err,task){
					if(err)
						res.send(err);
		 			res.json(task);
				});
		    }
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
		return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
	}

	calcTime = function(dt, ex){
		var sturtDate = new Date(dt.getTime()-parsMill(ex));
		return(getHMS(sturtDate));
	}

	freeTime = function(task){
		Task.find({checked:true, userid:task.userid},function(err,tasks){
			if(err)
				console.log(err);
			else if (tasks){
			
			var _iterator = function(task){
				//add '-' to convert the order
				return -(Date.parse(task.lastDate));
			};



			var sortChecked = _.chain(tasks).sortBy(_iterator);

			var _predicate = function(otherTask){
				otp = Date.parse(otherTask.lastDate);
				tp = Date.parse(task.lastDate);
				otx = otherTask.exDuration;
				tx = task.exDuration; 	
				return ((otp < tp) && (otx != null) && (tx != null));
			};
				var prev = sortChecked.find(_predicate);
				var prev = prev._wrapped;
				console.log(prev);

				if(prev){
					otp = Date.parse(prev.lastDate);
					tp = Date.parse(task.lastDate);
					var freeTime = parseVal(tp - otp - parsMill(task.exDuration));
					prev.exFreeTime = freeTime;
					prev.save(function(err,task){
						if (err)
							console.log(err);
						Log.findOne({lastDate:prev.lastDate}, function(err, log){
							console.log(log);
							if(err)
								console.log(err);
							else if(log){
								log.exFreeTime = freeTime;
								log.save(function(err, log){
									if(err)
										console.log(err);
								});	
							}
						});
					});
				}
			}
		});
	}

	logger = function(string){
		fs.appendFile('mainlog.log', string + " " +  new Date(Date.now()) + "\n"  , function(err){
			if (err) 
				console.log(err); 
		});
	}

	objectlogger = function(string){
		fs.appendFile('objectlog.log', string + " " +  new Date(Date.now()) + "\n" , function(err){
			if(err)
				console.log(err);
		});
	}




app.use("/TangiPlan", router);
app.listen("80");
console.log("walla");
