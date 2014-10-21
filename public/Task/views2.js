var ChooseTaskView_single = Backbone.View.extend({
		
	template: Handlebars.compile($("#singleTask").html()),	

	tagName:"li",

	events: {
		"click .checker" : "check"
	
	},


	check: function () {
		this.model.toggle();

	},

	initialize: function() {
		this.listenTo(this.model, "change", this.render);

	},

	render:function() {
		var html = this.template(this.model.attributes);
		this.$el.html(html);
		this.$(".checker").prop({disabled:this.model.get("disable")});
		this.$el.toggleClass("disable", this.model.get("disable"));
		return this;
	}

});	

	var MatcheObjectView_single = Backbone.View.extend({

	template: Handlebars.compile($("#matchTask").html()),

	tagName:"li",

	events:{
		"click .number" : "clickHandler",
		"click .clear" : "unsetObject"
	},

	unsetObject: function(){
		var curObjectId = this.model.get("objectId");
		this.$(".thumb").remove();
		this.$(".clear").remove();
		$("[id ="+curObjectId+"]").removeClass("disabled");
		this.model.save({"objectId":null});
	},	


	clickHandler: function(event){
		var curObjectId = this.model.get("objectId");
		if(curObjectId){
			this.unsetObject();
		}
		var id = $(event.currentTarget).attr("id");
		this.model.save({"objectId":id});
		this.updateView(id);
	},


	updateView: function(curObjectId){
		var str = "public/photos/num"+curObjectId+".png";
		this.$(".panel-heading").append("<img class='thumb' src="+str+">");
		this.$(".panel-heading").append("<a class ='clear'>'נקה בחירה'</a>");
		$("[id ="+curObjectId+"]").addClass("disabled");

	},



	render:function(){
		this.model.save({"objectId":null});
		var html = this.template(this.model.attributes);
		this.$el.html(html);
		return this;
	
	}
});	

var MatcheObjectViewV2_single = Backbone.View.extend({

	template: Handlebars.compile($("#matchTaskV2").html()),

	events: {
		"click .task" : "clickHandler",
	},


	update: function(){
		var current = taskList.findWhere({"objectId" : this.attributes.number});
		var title = current ? current.get("name") : "ללא משימה";
			this.$(".taskTitle").html(title);

	},
	
	initialize: function(){
		this.listenTo(taskList, "change" , this.update)
	},


	clickHandler: function(event){
		this.$(".collapse").collapse("hide");
		var current = taskList.findWhere({"objectId":this.attributes.number});
		if(current)
			current.set({"objectId":null});
		var taskName =  $(event.currentTarget).html();
		var task = taskList.findWhere({name:taskName});
		if(task)
			task.set({"objectId":this.attributes.number});
	},



	render: function () {
		var html = this.template({number:this.attributes.number});
		this.$el.html(html);
		this.checked = taskList.where({userid:app.user.get("_id"),checked:true});
		var iterator = function(task){
			var li = Handlebars.compile($("#tfoV2").html());
			li = li(task.attributes);
			this.$(".taskList").append(li);

		};

		iterator = _.bind(iterator, this);
		_.chain(this.checked).each(iterator);
		return this;
	},
});

/*var SetDuration_single = Backbone.View.extend({
	template: Handlebars.compile($("#setDuration").html()),

	tagName:"li",

	events:{
		"click  .task":"clickHandler",
	},

	set_clock: function(){
		var _func = function(valueText, btn, inst){
			if (btn == "set"){
				this.model.set({givDuration:valueText});
				app.user.updateLeft();
        	}
		};
		_func = _.bind(_func, this);

		this.$('input').mobiscroll().time({
			display : "modal",
            hourText : "דקות",
            minuteText : "שניות",
        	theme : "ios",
        	timeWheels:"HHii",
        	timeFormat: "HH:ii",
        	stepMinute: 30,
        	onClose: _func,
        });   

		var cur = this.model.get("givDuration");
		var cur = cur != null ? cur : "02:00"
		this.$('input').val(cur);
	
		
		

	},


	set: function(){
		this.model.set({givDuration:this.$('input').val()});
		app.user.updateLeft();
	},


	save: function(){
		var curDuration = this.$("input").val();
		var curObjectId = this.model.get("objectId");
		console.log(curObjectId);
		this.model.save({givDuration:curDuration,
						 exDuration:null,
						 objectId:curObjectId});
	},

	clickHandler: function(event){
		var objectId = this.attributes.objectId;
		var current = taskList.findWhere({"objectId":objectId});
		console.log(current);
		if(current)
			current.save({"objectId":null});
		var taskName =  $(event.currentTarget).html();
		var task = taskList.findWhere({name:taskName});
		if(task) {
			task.set({"objectId":objectId});
			this.model = task;
			this.render();
		}
	},

	render:function(){
		if(this.model.get("objectId") == this.attributes.objectId){
			var html = this.template(this.model.attributes);
			this.$el.html(html);
			this.$(".exDuration").toggleClass("warning", this.model.get("overexcep")==true);
			this.$(".exDuration").toggleClass("success", this.model.get("overexcep")==false);
			this.$("input").prop( "disabled", false);
			this.set_clock();
		}
		else{	
			 this.model = null;
			 var html = this.template({
			 	name:"ללא משימה",
			 	objectId:this.attributes.objectId,
			 	exDuration:""});
			 	this.$el.html(html);
			 	this.$("input").prop( "disabled", true );
			 }
			this.checked = taskList.where({userid:app.user.get("_id"),checked:true});
			var iterator = function(task){
				var li = "<li><a data-target='#' class='task'>"+task.get("name")+"</a></li>"
				this.$(".taskList").append(li);

			};
		iterator = _.bind(iterator, this);
		_.chain(this.checked).each(iterator);
		this.listenToOnce(this.model,"change",this.render);
		return this;
	}

});

	var checkDuration = Backbone.View.extend({
		template: Handlebars.compile($("#checkDuration").html()),

		tagName: "li",

		set_clock:function(){
			$.widget( "ui.timespinner", $.ui.spinner, {
	    		options: {
	      		// seconds
	     		step: 600 * 1000,
	    	    // minuits
	      		page: 60,

	      		disabled: true,

	      		
	    		},

	            _parse: function( value ) {  
	     	   		if ( typeof value === "string" ) {
	        			// already a timestamp
	      		  		if ( Number( value ) == value ) {
	        		    	return Number( value );
	       				}
	        			return +Globalize.parseDate( value );
	     			}	
	     			return value;
	   			},
	 
	    		_format: function( value ) {
	      
	     			return Globalize.format( new Date(value), "t" );
	   			}
 		});

		var x=this.$('input').timespinner();
		Globalize.culture('de-DE');
		this.$('input').timespinner('option','value', '02:00');
			this.$('input').val(this.model.get("exDuration"));
		
		

		
		

	},

		render:function(){

		var html = this.template(this.model.attributes);
		this.$el.html(html);
		this.set_clock();
		return this;
	}


		
});*/

var SetDuration_single = Backbone.View.extend({

	template: Handlebars.compile($("#setDuration").html()),


		events:{
		"click  .task":"clickHandler",
		"click .addon" : "freeTimeTrigger",
	},

		clickHandler: function(event){
			var objectId = this.attributes.objectId;
			var current = this.model;
			var taskName =  $(event.currentTarget).html();
			var task = taskList.findWhere({name:taskName});
			var lastid;

			lastid = task.get("objectId");
			task.set({"objectId":objectId},{silent:true});
			task.set({"lastObjectId":objectId},{silent:true});
			current.set({"objectId":lastid});
			current.set({"lastObjectId":lastid});
			task.trigger("change");
			
		},

		freeTimeTrigger: function(){
			this.$(".taskBar").toggleClass("marged");
			this.$(".freeTime").toggle();
			
		},

		set_clock: function(){
		var _func = function(valueText, btn, inst){
			if (btn == "set"){
				this.model.set({givDuration:valueText});
				app.user.updateLeft();
        	}
		};
		_func = _.bind(_func, this);

		this.$('.input').mobiscroll().timespan({
			display : "bubble",
            hourText : "דקות",
            minuteText : "שניות",
            cancelText: "ביטול",
            labelsShort: ["","","","דקות","שניות"],
            setText: "הגדר",
        	theme : "ios7",
        	timeWheels:"HHii",
        	timeFormat: "HH:ii",
        	steps: [1,30],
        	onClose: _func,
        	wheelOrder: 'hh:ii',
  		  	parseValue: function (d) { 
        				var ret = [0, 0]; 
      					if (d) { 
          				  ret = d.split(':')
            			  ret[0] = isNaN(+ret[0]) ? 0 : +ret[0];
            			  ret[1] = isNaN(+ret[1]) ? 0 : +ret[1];
       					}
       			 		return ret;
    		},
    		formatResult: function (d) {
       			return (d[0] < 10 ? '0' : '') + d[0] + ':' + (d[1] < 10 ? '0' : '') + d[1];
    		},
        });   

		var cur = this.model.get("givDuration");
		var cur = cur != null ? cur : "02:00";
		this.$('.input').val(cur);
		this.model.set({givDuration:cur});
	
		
		

	},

	set_freeTimeClock: function(){
		var _func = function(valueText, btn, inst){
			if (btn == "set"){
				this.model.set({givFreeTime:valueText});
				app.user.updateLeft();
        	}
		};
		_func = _.bind(_func, this);

		this.$('.freeTimeInput').mobiscroll().timespan({
			display : "bubble",
            hourText : "דקות",
            minuteText : "שניות",
            cancelText: "ביטול",
            setText: "הגדר",
        	theme : "ios7",
        	labelsShort: ["","","","דקות","שניות"],
        	timeWheels:"HHii",
        	timeFormat: "HH:ii",
        	steps:[1,30],
        	onClose: _func,
        	wheelOrder: 'hh:ii',
  		  	parseValue: function (d) { 
        				var ret = [0, 0]; 
      					if (d) { 
          				  ret = d.split(':')
            			  ret[0] = isNaN(+ret[0]) ? 0 : +ret[0];
            			  ret[1] = isNaN(+ret[1]) ? 0 : +ret[1];
       					}
       			 		return ret;
    		},
    		formatResult: function (d) {
       			return (d[0] < 10 ? '0' : '') + d[0] + ':' + "00";
    		},
        });   

		var cur = this.model.get("givFreeTime");
		var cur = cur != null ? cur : "01:00";
		this.$('.freeTimeInput').val(cur);
		this.model.set({givFreeTime:cur});
	},

	render: function(){
		app.user.updateLeft();
		app.user.trigger("change");	
		if(this.model.get("objectId") != this.attributes.objectId){
				this.model = taskList.findWhere({objectId:this.attributes.objectId, userid:app.user.get("_id")});
			}
			var html = this.template(this.model.attributes);
			var flag = this.model.get("overexcep");
			var freeTimeflag = app.user.parsMill(this.model.get("exFreeTime")) > app.user.parsMill(this.model.get("givFreeTime")) * 1.2;
			if(!this.model.get("exFreeTime"))
				freeTimeflag = true;

			var timeSpanref = {theme:"bootstrap",
							labels:["דקות", "שניות"],
							maxTime:1800000,
							steps:[1,10],
							wheelOrder:"iiss",
							display:"bubble"};

			
			this.$el.html(html);
			this.$(".freeTime").hide();
			this.$(".taskBar").addClass("marged");

			this.$(".exDuration").toggleClass("warning", flag == true);
			this.$(".exDuration").toggleClass("success", flag == false);
			this.$(".addon").toggleClass("warning", freeTimeflag == true);
			this.$(".addon").toggleClass("success", freeTimeflag == false);

			this.listenToOnce(this.model,"change",this.render);



			this.set_clock();
			this.set_freeTimeClock();
	

		//create the dropdown list
		this.$(".taskList").html("");
		var checked = app.user.checked();

		var iterator = function(task){
			var li = "<li><a data-target='#' class='task'>"
					  +task.get("name")+"</a></li>";
			this.$(".taskList").append(li);
		};

		iterator = _.bind(iterator, this);
		_.chain(checked).each(iterator);

		return this;
				
	}
});

var checkTask = Backbone.View.extend({

	template: Handlebars.compile($("#checkTask").html()),

	initialize: function(){
		var objectId = this.model.get("objectId");
		var lastObjectId = this.model.get("lastObjectId");
		this.objectId = objectId ? objectId : lastObjectId;
		this.listenTo(this.model, "change", this.render);
	},

	render: function(){
		var html = this.template({
			name:this.model.get("name"),
			objectId:this.objectId,
			exDuration: this.model.get("exDuration"),
		});
		this.$el.html(html);
		if(this.model.get("exDuration")){
			this.$(".checkTask").addClass("done");
		}
		return this;
	},

});

