var SetDuration_page = Backbone.View.extend({

	template: Handlebars.compile($("#setDurations").html()),

	events:{
		"click .next":"next",
		"click .back":"back",
		"click .toggleAll" : "toggleAll",
		
	},

	toggleAll: function(){
		var flag = false;

		_.chain(this.$(".freeTime")).each(function(single){
			console.log(single);
			if(!($(single).is(":visible")))
				flag = true;
		});

		if(flag){
			this.$(".freeTime").show();
			this.$(".taskBar").removeClass("marged");
		}
		else{
			this.$(".freeTime").hide();
			this.$(".taskBar").addClass("marged");
		}

	},

	next:function(){

		if(!this.model.timeValidate())
			alert("שעת סיום התארגנות מאוחרת משעת היציאה שהגדרת באפשרותך לשנות שעת יציאה שעת התעוררות או את זמני המשימות והמעבר")

		else if(this.validate()){
			var nav = _.after(this.model.checked().length, function(){
				if (app.last == "signIn")
					router.navigate("", true);
				else
					router.navigate("placeObject",true);
			});
			_.chain(this.model.checked())
			.each(function(task){
				task.set({exDuration:null});
				task.set({overexcep:null});
				task.set({exFreeTime:null});
				task.save(task.attributes,{success:nav});
			});
		}
		else
			alert("יש משימות שלא משויכות לאוביקט")

	},

	validate: function(){
		var checked = this.model.checked();
		var flag = true;
		
		_.chain(checked).each(function(task){
			if(task.get("objectId") == null)
				flag = false;
		});

		return flag;

	},

	back: function(){

		if(app.last === "signIn")
			router.navigate("",true);
		else
			router.navigate("choose_tasks", true);
	},



	initialize: function(){

		var comTitle = Handlebars.compile($("#titleBar").html());
		var title = comTitle({title:"הגדר זמנים"});
		var comNav = Handlebars.compile($("#bottom-nav").html());
		var nav = comNav({end:"עדכן משימות"});


		this.model.updateLeft();

		this.$el.html(title);
		this.$el.append(this.template(this.model.attributes));
		this.$el.append(nav);
		
		this.build = _.bind(this.build, this);
		taskList.fetch({success:this.build});
		this.listenTo(this.model, "change", this.updateSpan);
		this.set_wakeUpClock();
		this.set_goOutClock();

		
	},


	set_wakeUpClock: function(){
		var _func = function(valueText, btn, inst){
			if (btn == "set"){
				this.model.set({wakeUp:valueText});
				app.user.updateLeft();
        	}
		};
		_func = _.bind(_func, this);

		this.$(".wakeUp").mobiscroll().time({
			display : "modal",
       	    hourText : "שעות",
		    minuteText: "דקות",
		    cancelText: "ביטול",
            setText: "הגדר",
		    theme:"ios7",
		    height:"100",
		    timeWheels:"HHii",
		    timeFormat: "HH:ii",
		    stepMinute:5,
        	onClose: _func,
        });

        var cur = this.model.get("wakeUp");
		var cur = cur != null ? cur : "07:00"
		this.$('.wakeUp').val(cur);
		this.model.set({wakeUp:cur});   
	},

	set_goOutClock: function(){
		var _func = function(valueText, btn, inst){
			if (btn == "set"){
				this.model.set({goOut:valueText});
				app.user.updateLeft();
        	}
		};
		_func = _.bind(_func, this);

		this.$(".goOut").mobiscroll().time({
			display : "modal",
       	    hourText : "שעות",
		    minuteText: "דקות",
		    cancelText: "ביטול",
            setText: "הגדר",
		    theme:"ios7",
		    height:"100",
		    timeWheels:"HHii",
		    timeFormat: "HH:ii",
		    stepMinute:5,
        	onClose: _func,
        }); 

        var cur = this.model.get("goOut");
		var cur = cur != null ? cur : "08:00"
		this.$('.goOut').val(cur);
		this.model.set({wakeUp:cur});  
	},


	updateSpan: function(){
		this.$(".wakeUp").html(this.model.get("wakeUp"));
		this.$(".arangeTime").html(this.model.get("arangeTime"));
		this.$(".endToArange").html(this.model.get("endToArange"));
		this.$(".goOut").html(this.model.get("goOut"));


	},

	build: function(){
		var _iterator = function(task){
			return Date.parse(task.get("lastDate"))
		};
		var checked = this.model.checked();
		var sortChecked = _.chain(checked).sortBy(_iterator);
		var numbers = [6,5,4,3,2,1];

		_.chain(sortChecked).each(function(task){
			if(task.get("lastObjectId")){
				numbers = _.reject(numbers,function(num){
					return num == task.get("lastObjectId");
				});
			}
		});
		var viewList = [];
		sortChecked.each(function(task){
			if(task.get("lastObjectId"))
				task.set({objectId:task.get("lastObjectId")});
			else{
				console.log(numbers);
				task.set({objectId:numbers.pop()});
			}

			var oneView = new SetDuration_single({model:task, attributes:{objectId:task.get("objectId")}});
			this.$(".setList").append(oneView.render().el);
			viewList.push(oneView);
		});
		
		this.viewList = viewList;

		/*this.timeBar();
		this.listenTo(this.model, "change", this.timeBar);*/
	
	},

	/*timeBar: function(){
		var data = this.viewList;
		var colors = ["blue","yellow","green","cyan","pink","purple"]
		var cont = d3.select(".timeBar")
					 .html("")
					 .attr("width",1110);

		cont.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x",function(d,i){
				console.log(i);
				if(data[i-1] != null){
					d.x = app.user.parsMill(data[i-1].model.get("givDuration"))/1000 + data[i-1].x;
					return d.x;
				}
				else{
					d.x = 0;
					return d.x;
				}

			})
			.attr("y",0)
			.attr("height",20)
			.attr("width",function(d){
				return app.user.parsMill(d.model.get("givDuration"))/1000;
			})
			.style("fill",function(d){
				return colors[d.model.get("objectId")-1];
			});



	}*/

});