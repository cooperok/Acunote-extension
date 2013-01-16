var TaskField_class = new Class({

	/**
	 * Task which contains this field
	 */
	task: null,

	/**
	 * Name of the field
	 * @type String
	 */
	name: null,

	/**
	 * Current value of the field
	 * @type String
	 */
	value: null,

	/**
	 * @type String
	 */
	old_value: null,

	initialize: function(task) {

		this.task = task;

		this.getValue();

	},

	getValue: function() {

		var current_text_value = this.getCurrentTextValue();

		var values = this.getPosibleValues();

		values.getChildren().each(function(option){

			if( current_text_value == option.innerHTML ) {

				this.value = option.value;

			}

		}.bind(this));

	},

	getCurrentTextValue: function() {},

	getPosibleValues: function() {},

	changeValue: function(value) {

		this.old_value = this.value === null ? '' : this.value;

		this.value = value;

		var params = 'number=' + this.task.id +
			'&field=' + this.name +
			'&view=' + this.task.getView() +
			'&value=' + this.value +
			'&old_value=' + this.old_value +
			'&authenticity_token=' + this.task.getAuthenticityToken() +
			'&_=' + '';

		new Request({
			url: 'https://' + location.host + '/issues/update',
			'method': 'post'
		}).send(params);

	}

});