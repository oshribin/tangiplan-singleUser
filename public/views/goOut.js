var GoOut_page = Backbone.View.extend({
	template: Handlebars.compile($("#wakeUp").html()),

  events:{
    "click .next":"next",
    "click .back":"back",
  },

  back: function(){
    router.navigate("wake_up",true);
  },


  next: function(){
    
    var curgoOut = this.$("input").val();
    this.model.save({goOut:curgoOut},{success:function(){
       if(app.user.parsMill(app.user.timeLeft()) > 0)
          router.navigate("choose_tasks", true);
        else
          alert("הזנת שעת התעוררות ל-"+app.user.get("wakeUp")+" עליך להזין שעת יציאה מאוחרת משעה זו")
    }});


  },


	initialize: function(){
    var comTitle = Handlebars.compile($("#titleBar").html());
    var title = comTitle({title:"מתי אתה יוצא ?"});
    var comNav = Handlebars.compile($("#bottom-nav").html());
    var nav = comNav();

    this.$el.html(title);
    this.$el.append(nav);
		this.$el.append(this.template);

		this.set_clock();

	},

	set_clock:function(){
    this.$('input').mobiscroll().time({
      display : "inline",
      hourText : "שעות",
      minuteText: "דקות",
      theme:"ios",
      height:"100",
      timeWheels:"HHii",
      timeFormat: "HH:ii",
      stepMinute:5,
    });   
    this.$('input').val("02:00");	

	},

});