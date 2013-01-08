var Model_class = new Class({

	initialize: function() {

		this.storage = localStorage;

	},

	setValue: function(item, value) {

		this.storage.setItem(item, value);

	},

	getValue: function(value) {

		return this.storage.getItem(value);

	}

});