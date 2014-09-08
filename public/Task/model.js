var Task = Backbone.Model.extend({

	urlRoot:"/TangiPlan/tasks",

	defaults: function() {
		return {
			name: "",
			givDuration: null,
			exDuration:null,
			objectId:null,
			lastObjectId:null,
			lastDate:null,
			checked:false,
			disable:false,
			exception:null,
			endedByUser:null,
			overexcep:null,
			userid:null,
			
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
			timeLeft:"",
			clUsage:0,
		};
	},

	idAttribute:"_id",

	clUsageInc: function(){
		var inc = this.get("clUsage") + 1;
		this.save({clUsage:inc});
	},

	timeLeft: function(){
		var start = this.get("wakeUp");
		var end = this.get("goOut");
		var milstart = this.parsMill(start);
		var milend = this.parsMill(end);
		console.log(milstart + milend);
		return (this.parseVal(milend*60-milstart*60));

	},

	sumDurations: function(){
		var taskTosum = taskList.where({userid:this.get("_id"),checked:true});
		var iterator = function(memo, task){
			return memo + this.parsMill(task.get("givDuration"));
		};
		var iterator = _.bind(iterator, this);
		var sum = _.chain(taskTosum).reduce(function(memo, task){
			return iterator(memo, task);}, 0);
		return (sum._wrapped + ((taskTosum.length-1)*60000));
	},

	updateLeft: function(){
		var current = this.parsMill(this.timeLeft());
		var update = this.parseVal(current - this.sumDurations());
		this.set({timeLeft:update});
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
		var sep = duration.indexOf(":")
		var m = parseInt(duration.substring(0,sep));
		var s = parseInt(duration.substring(sep+1,5));
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



