var Task = Backbone.Model.extend({

	urlRoot:"TangiPlan/tasks",

	defaults: function() {
		return {
			name: "",
			givDuration: null,
			exDuration:null,
			objectId:null,
			lastDate:null,
			checked:false,
			disable:false,
			
		};	
	},

	idAttribute:"_id",



	

	toggle: function() {
		this.set({checked:!this.get("checked")});
	}

});
