var Acunote_class = new Class({

	Class: 'Acunote_class',

	/**
	 * List of tasks
	 * @type object
	 */
	tasks: null,

	/**
	 * List of owners values
	 * @type object
	 */
	owners: null,

	/**
	 * List of priority values
	 * @type object
	 */
	priority: null,

	actions: ['getValues', 'fillTasks'],

	initialize: function() {

		this.owners = this.getOwners();

		this.priotity = this.getPriority();

		this.statuses = this.getStatuses();

		this.tasks = this.getTasks();

	},

	getOwners: function() {

		return this.getSelectValues( $('issue_dynamic_owner_editor') );

	},

	getPriority: function() {

		return this.getSelectValues( $('issue_dynamic_priority_editor') );

	},

	getStatuses: function() {

		return this.getSelectValues( $('issue_current_status') );

	},

	getSelectValues: function(select) {

		var values = {};

		select.getChildren().each(function(option){

			values[ option.innerHTML ] = option.value;

		});

		return values;

	},

	getTasks: function() {

		var tasks = {};

		$('issues').getChildren().each(function(task){

			var task = new Task_class(task);

			tasks[task.id] = task;

		}.bind(this));

		return tasks;

	},

	getActions: function() {

		return this.actions;

	},

	getValues: function(params) {

		return {
			'owner' : this.owners,
			'priority': this.priotity,
			'status': this.statuses
		};

	},

	fillTasks: function(params) {

		if(params.values) {

			for(var task in this.tasks) {

				if( this.tasks[task].isActive() ) {

					for(var param_name in params.values) {

						this.tasks[task].changeFieldValue(param_name, params.values[param_name]);

					}

				}

			}

			var return_value = {};

		} else {

			var return_value = {'error': 'Trying to fill tasks without values'};

		}

		return return_value;

	}

});