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

var StatusField_class = new Class({

	Extends: TaskField_class,

	name: 'status',

	getCurrentTextValue: function() {

		return $('issue_status_' + this.task.id).getElement('a').innerHTML;

	},

	getPosibleValues: function() {

		return $('task_dynamic_status_editor') || $('issue_current_status');

	}

});

var OwnerField_Class = new Class({

	Extends: TaskField_class,

	name: 'owner',

	getCurrentTextValue: function() {

		return $('issue_owner_' + this.task.id).getElement('a').innerHTML;

	},

	getPosibleValues: function() {

		return $('owner_filter') || $('issue_dynamic_owner_editor');

	}

});

var PriorityField_Class = new Class({

	Extends: TaskField_class,

	name: 'priority',

	getCurrentTextValue: function() {

		return $('issue_priority_' + this.task.id).getElement('a').innerHTML;

	},

	getPosibleValues: function() {

		return $('task_dynamic_priority_editor') || $('issue_dynamic_priority_editor');

	}

});

var EstimateField_Class = new Class({

	Extends: TaskField_class,

	name: 'estimate',

	getValue: function() {

		this.value = $('issue_estimate_' + this.task.id).getElement('a').innerHTML;

	}

});


var Task_class = new Class({

	/**
	 * Parent element of task
	 */
	element: null,

	/**
	 * ID of this task
	 */
	id: null,

	/**
	 * List of posible actions, called from request handler
	 * @type Object
	 */
	actions: null,

	/**
	 * Fields which contains this task
	 * @type Object
	 */
	fields: null,

	/**
	 * @type String
	 */
	view_type: null,

	initialize: function(element) {

		this.actions = {
			'owners': 'changeOwner',
			'statuses': 'changeStatus',
			'priority': 'changePriority',
			'estimate': 'changeEstimate'
		};

		this.element = element;

		this.id = this.element.id.match(/[a-z_]+(\d+)$/)[1];

		this.checkbox = $('checkbox_' + this.id);

		this.createFields();

	},

	createFields: function() {

		this.fields = {
			'status':   new StatusField_class(this),
			'owner':    new OwnerField_Class(this),
			'priority': new PriorityField_Class(this),
			'estimate': new EstimateField_Class(this)
		};

	},

	changeFieldValue: function(field_name, field_value) {

		if( this.fields[field_name]) {

			this.fields[field_name].changeValue(field_value);

		}

	},

	isActive: function() {

		return !!this.checkbox.checked;

	},

	getAuthenticityToken: function() {

		return encodeURIComponent($(document.body).getElement('input[name=authenticity_token]').value);

	},

	getView: function() {

		//hardcode for first time, i'm tired
		return 'issue_list';

	}

});

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

var RequestHandler_class = new Class({

	handler_actions: null,

	initialize: function() {

		this.handler = new Acunote_class();

		this.handler_actions = this.handler.getActions();

	},

	/**
	 * Handling extensions requests
	 * @param msg Object
	 */
	handle: function(msg) {

		if(typeOf(msg) == 'object') {

			if(msg['action']) {

				if(this.handler_actions.indexOf(msg['action']) != -1) {

					var return_value = this.handler[ msg['action'] ](msg);

				} else {

					var return_value = {'error': 'Action "' + msg['action'] + '" don\'t exists'};

				}

			} else {

				var return_value = {'error': 'Send action name as \'action\' value'};

			}

		} else {

			var return_value = {'error': 'Request value must be object, ' + typeOf(msg) + ' given'};

		}

		return return_value;

	}

});

var ContentPort_class = new Class({

	port: null,

	requestHandler: null,

	extension_name: 'Acunote helper',

	initialize: function() {

		this.requestHandler = new RequestHandler_class();

		this.port = chrome.extension.connect({name: this.extension_name});

		//Adding event listener for extensions requests
		this.port.onMessage.addListener(this.onMessage.bind(this));

		//Adding event listener for single extension request
		chrome.extension.onRequest.addListener(this.onSingleRequest.bind(this));

	},

	/**
	 * Extension requests handler
	 * @param msg - mixed values
	 */
	onMessage: function(msg) {

		var response = this.requestHandler.handle(msg);

		this.sendRequest(response);

	},

	/**
	 * Handler of single request from extension
	 * @param request - mixed values sended by the extension
	 * @param sender - tab which had sent a request
	 * @param sendResponse - callback function
	 */
	onSingleRequest: function(request, sender, sendResponse){

		var response = this.requestHandler.handle(request);

		sendResponse(response);

	},

	/**
	 * Sending request to extension
	 * @param request - mixed values
	 */
	sendRequest: function(request) {

		this.port.postMessage(request);

	}

});

var ContentPort = new ContentPort_class();