var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Task = require("./models/task");
mongoose.connect("mongodb://localhost:27017/test");
app.use(bodyParser());



var router = express.Router();

router.get("/TangiPlan", function(req, res) {
	res.sendfile("index.html");
	
});


router.use("/TangiPlan/public", express.static("public"));

router.route("/TangiPlan/tasks")

	.post(function(req,res){
		var task = new Task({
			name:req.body.name,
			givDuration:req.body.givDuration,
			objectId:req.body.objectId
		});

		task.save(function(err){
			if(err)
				res.send(err);
		
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


router.route("/TangiPlan/getDuration/:object_id")

	.get(function(req, res){
		Task.findOne({objectId:req.params.object_id}, function(err, task){
			if(err)
				res.send(err);
			if(task)
				res.send(task.objectId+":"+parsMill(task.givDuration));
			res.send("there is not task that match this id");
		});
	});

router.route("/TangiPlan/setDuration/:object_id/:ex_duration/:flag")

	.get(function(req, res){
		Task.findOne({objectId:req.params.object_id}, function(err, task){
			if(err)
				res.send(err)
			if(task){
				task.exDuration = parseVal(req.params.ex_duration);
				task.exception = parseVal(parsMill(task.givDuration)-req.params.ex_duration);
				task.endedByUser = req.params.flag ? true : false;
				task.save(function(err, task){
					if(err)
						res.send(err)
					res.send("deleted")
				});
			}
			else
				res.send("there is not task that match this id");	
		});
	});

	

router.route("/TangiPlan/tasks/:task_id")

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
			
			task.save(function(err,task){
				if(err)
					res.send(err)
	 			res.json(task)
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





app.use("/", router);
app.listen("8080");
console.log("walla");
