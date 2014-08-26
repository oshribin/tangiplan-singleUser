var Task = Backbone.Model.extend({

	urlRoot:"/TangiPlan/tasks",

	defaults: function() {
		return {
			name: "",
			givDuration: null,
			exDuration:null,
			objectId:null,
			lastDate:null,
			checked:false,
			disable:false,
			exception:null,
			endedByUser:null,
			overexcep:null,
			username:null,
			
		};	
	},

	idAttribute:"_id",	

	toggle: function() {
		this.set({checked:!this.get("checked")});
	}

});

var User = Backbone.Model.extend({

	urlRoot: "/TangiPlan/users",

	defaults: function(){
		return{
			name:"",
			pass:"",
			wakeUp:null,
			goOut:null,
			timeLeft:""
		};
	},

	idAttribute:"_id",

	timeLeft: function(){
		var start = this.get("wakeUp");
		var end = this.get("goOut");
		var milstart = this.parsMill(start);
		var milend = this.parsMill(end);
		console.log(milstart + milend);
		return (this.parseVal(milend*60-milstart*60));

	},

	sumDurations: function(){
		var taskTosum = taskList.where({checked:true});
		var iterator = function(memo, task){
			return memo + this.parsMill(task.get("givDuration"));
		};
		var iterator = _.bind(iterator, this);
		var sum = _.chain(taskTosum).reduce(function(memo, task){
			return iterator(memo, task);}, 0);
		console.log(sum._wrapped);
		return (sum._wrapped);
	},

	updateLeft: function(){
		var current = this.parsMill(this.timeLeft());
		console.log(this.get("timeLeft"));
		console.log(current);
		var update = this.parseVal(current - this.sumDurations());
		console.log(update);
		this.set({timeLeft:update});
		console.log(this.get("timeLeft"));

	},

	decreasLeft: function(){
		var current = this.parsMill(this.get("timeLeft"));
		var update = this.parseVal(current - 10000);
		this.set({timeLeft:update});
	},

	increasLeft: function(){
		var current = this.parsMill(this.get("timeLeft"));
		var update = this.parseVal(current + 10000);
		this.set({timeLeft:update});

	},

	parsMill: function(duration){
		if (duration == null)
			duration = "02:00";
		console.log(duration);
		console.log(duration.substring(0,2));
		var m = parseInt(duration.substring(0,2));
		var s = parseInt(duration.substring(3,5));
		return((m*60000)+(s*1000));
	},

	parseVal: function(duration){
		var absDuration = Math.abs(duration);
		var m = Math.floor(absDuration/60000);
		var s = Math.floor((absDuration%60000)/1000);
		if(s<10)
			s="0"+s;
		if (m<10)
			m="0"+m;
		var str = duration < 0 ?  "-"+m+":"+s : m+":"+s;		
			return str;	
	},

});



