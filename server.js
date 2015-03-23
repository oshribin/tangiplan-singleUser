var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session")	;
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


var router = express.Router();

router.route("/getDuration/:object_id")
	
	.get(function(req, res){
		req.session = null;
		Task.findOne({objectId:req.params.object_id, set_id:req.params.set_id}, function(err, task){
			if(err){
				//eror while looking for task
				logger({entity:"object spark",
						name:req.params.object_id,
						date: new Date(Date.now()),
						request: "/getDuration/"+req.params.object_id,
						action: "getDuration",
						result:"error"
						});
				res.send(err);
			}

			else if(task && task.givDuration){
				res.send(task.objectId+":"+parsMill(task.givDuration));
				//succeed to send task
				logger({entity:"object spark",
						name:req.params.object_id,
						date: new Date(Date.now()),
						request: "/getDuration/"+req.params.object_id,
						action: "getDuration",
						result: task.objectId+":"+parsMill(task.givDuration),
						});
			}
			else{
				res.send(req.params.object_id +":"+ -1);
				//there is no task
				logger({entity:"object spark",
						name:req.params.object_id,
						date: new Date(Date.now()),
						request: "/getDuration/"+req.params.object_id,
						action: "getDuration",
						result: req.params.object_id +":"+ -1,
						});
			}
		});
	});

app.use(session({secret: "keyboard cat",  cookie:{maxAge:10*24*60*60*1000}}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


router.get("/objectslogfile", function(req, res){
	res.sendfile("objectlog.log");
});




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
			csvStream.pipe(writableStream);
			logs.forEach(function(log){
				csvStream.write(log.toObject());
			});	
			csvStream.end();
		}
	});
});

router.get("/", function(req, res) {
	res.sendfile("index2.html");
	console.log(req.session.passport.user);
});

app.get("/currentUser", function(req,res){
	if(req.session.passport.user){
		res.send(req.session.passport.user.name);
	}
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
  				logger({entity:"User",
						name:req.session.passport.user.name,
						date: new Date(Date.now()),
						request: "/login",
						action: "login",
						result:"connected"
						});
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
	res.send("objecton");
	logger({entity:"object spark",
			name:req.params.objectId,
			date: new Date(Date.now()),
			request: "/objectOn/" + req.params.objectId + "/" + req.params.timeStamp,
			action: "objectOn",
			result: "object on",
			});
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



router.route("/setDuration/:object_id/:ex_duration/:flag")

	.get(function(req, res){
		Task.findOne({objectId:req.params.object_id, set_id:req.params.set_id}, function(err, task){
			if(err){
				logger({entity:"object spark",
						name: req.params.object_id,
						date: new Date(Date.now()),
						request: "/setDuration/" + req.params.object_id + "/" + req.params.ex_duration + "/" + req.params.flag,
						action: "setDuration",
						result: "error",
						});
				res.send(err)
			}
			if(task){
				var _parsDuration = parsMill(task.givDuration);
				var _millexception = req.params.ex_duration - _parsDuration;
				var objectId = task.objectId;
				var lastDate = Date.now();

				task.exDuration = parseVal(req.params.ex_duration);
				task.exception = parseVal(_millexception);
				task.overexcep = _millexception > (0.2*_parsDuration);
				task.lastDate = lastDate;
				task.lastObjectId = objectId;
				task.objectId = null;
				task.save(function(err, task){
					if(err){
						logger({entity:"object spark",
								name: req.params.object_id,
								date: new Date(Date.now()),
								request: "/setDuration/" + req.params.object_id + "/" + req.params.ex_duration + "/" + req.params.flag,
								action: "setDuration",
								result: "error",
								});
						res.send(err)
					}
					else if(task){
						
						var prev = freeTime(task);
	
						User.findOne({_id:task.userid}, function(err, user){
							if(err){
								logger({entity:"object spark",
										name: req.params.object_id,
										date: new Date(Date.now()),
										request:"/setDuration/" + req.params.object_id + "/" + req.params.ex_duration + "/" + req.params.flag,
										action: "setDuration",
										result: "error",
										});
								res.send(err)
							}

							else if(user != null){
									res.send("task end");
									logger({entity:"object spark",
											id: req.params.object_id,
											date: new Date(Date.now()),
											request: "/setDuration/" + req.params.object_id + "/" + req.params.ex_duration + "/" + req.params.flag,
											action: "setDuration",
											result:"task end",
											taskName: task.name,
											givDuration: task.givDuration,
											exDuration: task.exDuration,
											exception: task.exception,
											endedByUser: req.params.flag,
											overexcep: task.overexcep,
											userId: user._id,
											exFreeTime: task.exFreeTime,
											givFreeTime: task.givFreeTime,
											endTime: getHMS(task.lastDate),
											startTime: calcTime(task.lastDate, task.exDuration),		
											wakeUp: user.wakeUp, 
											goOut: user.goOut,
											taskDate: getYMD(task.lastDate),
									});
								}
							});
						}
					});
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

	logger = function(prop){
		var log = new Log(prop);
		log.save(function(err, log){
			if(err){
				console.log(prop);
				console.log(err);
			}
		});
		fs.appendFile('objectlog.log', + " " + prop.entity +" " + prop.name + " " + prop.date + " " + prop.action + " " + prop.result + "\n" , function(err){
			if(err)
				console.log(err);
		});
	}




app.use("/TangiPlan", router);
app.listen("80");
console.log("walla");
