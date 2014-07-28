var Task = Backbone.Model.extend({

	defaults: function() {
		return {
			name: "",
			givDuration: null,
			exDuration:null,
			pobjectId:null,
			lastDate:null,
			checked:false
		};
	},

	toggle: function() {
		this.save({checked:!this.get(checked)});
	}

});
