var GoOut_page = Backbone.View.extend({
	template: Handlebars.compile($("#wakeUp").html()),

  events:{
    "click .next":"next",
  },

  next: function(){
    
    var curgoOut = this.$("input").val();
    this.model.save({goOut:curgoOut});
    router.navigate("choose_tasks", true);


  },

	initialize: function(){
		var compiled = Handlebars.compile($("#titleBar").html());
		var title = compiled({title:"מתי אתה יוצא ?"});
		this.$el.append(title);
		this.$el.append(this.template);
		this.set_clock();

	},

	set_clock:function(){
    this.$('input').mobiscroll().time({
      display : "inline",
      hourText : "שעות",
      minuteText: "דקות",
      theme:"ios",
      height:"100"});   
    this.$('input').val("02:00");	

	},

});