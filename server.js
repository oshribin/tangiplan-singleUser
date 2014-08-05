var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Task = require("./models/task");
mongoose.connect("mongodb://localhost:27017/test");
app.use(bodyParser());



var router = express.Router();

router.get("/", function(req, res) {
	res.sendfile("index.html");
	
});


router.use("/public", express.static("public"));

router.route("/tasks")

	.post(function(req,res){
		var task = new Task({
			name:req.body.name
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


router.route("/object/:object_id")

	.get(function(req, res){
		Task.findOne({objectId:1}, function(err, task){
			if(err)
				res.send(err);
			res.send(task.objectId+":"+task.givDuration);

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
			
			task.save(function(err,bear){
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





app.use("/TangiPlan", router);
app.listen("8080");
console.log("vwalla");