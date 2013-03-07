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

		this.tags = this.getTags();

		this.statuses = this.getStatuses();

		this.tasks = this.getTasks();

	},

	getOwners: function() {

		return this.getSelectValues( document.id('new_task_dialog_user') );

	},

	getPriority: function() {

		return this.getSelectValues( document.id('new_task_dialog_task_priority') );

	},

	getStatuses: function() {

		return this.getSelectValues( document.id('issue_dynamic_status_editor') || document.id('task_dynamic_status_editor') );

	},

	getTags: function() {

		var values = {};

		Slick.search('span[id^=apply_tag_]').each(function(span){
			values[span.get('html')] = span.get('id').replace('apply_tag_', '');
		});

		return values;

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

		document.id('issues').getChildren().each(function(task){

			var task = new Task_class(task, this.getView(), this.getAuthenticityToken());

			tasks[task.id] = task;

		}.bind(this));

		return tasks;

	},

	/**
	 * It's just for first time, i promise
	 */
	getView: function() {

		return 'issue_list';

	},

	getActions: function() {

		return this.actions;

	},

	getValues: function(params) {

		return {
			'owner'     : this.owners,
			'priority'  : this.priotity,
			'apply_tag' : this.tags,
			'remove_tag': this.tags,
			'status'    : this.statuses
		};

	},

	fillTasks: function(params) {

		if(params.values) {

			var active_tasks_id = this.getActiveTasksId();

			//checking selected tasks
			if (active_tasks_id.length) {

				//Tags applying for all tasks in single request, so we need to apply them
				//and remove this value from params
				if (params.values.apply_tag) {

					this.applyTags(params.values.apply_tag, active_tasks_id);

					delete params.values.apply_tag;

				}

				if (params.values.remove_tag) {

					this.removeTags(params.values.remove_tag, active_tasks_id);

					delete params.values.remove_tag;

				}

				active_tasks_id.each(function(task_id){

					for(var param_name in params.values) {

						this.tasks[task_id].changeFieldValue(param_name, params.values[param_name]);

					}

				}.bind(this));

			}

			var return_value = {};

		} else {

			var return_value = {'error': 'Trying to fill tasks without values'};

		}

		return return_value;

	},

	getActiveTasksId: function() {

		var ids = [];

		for(var task_id in this.tasks) {

			if( this.tasks[task_id].isActive() ) {

				ids.push(task_id);

			}

		}

		return ids;

	},

	applyTags: function (tag_id, active_tasks_id) {

		var params = 'selected_issues=' + active_tasks_id.join(',') +
			'&tag_id=' + tag_id +
			'&view=' + this.getView() +
			'&page=' + this.getPage() +
			( this.getProjectId() ? '&project_id=' + this.getProjectId() : '') +
			'&query=' + this.getQuery() +
			'&toolbox_action=apply_tag' +
			'&authenticity_token=' + this.getAuthenticityToken() +
			'&_=' + '';

		new Request({
			url: 'https://' + location.host + '/issues/apply_tag',
			'method': 'post'
		}).send(params);

	},

	removeTags: function(tag_id, active_tasks_id) {

		var params = 'selected_issues=' + active_tasks_id.join(',') +
			'&tag_id=' + tag_id +
			'&view=' + this.getView() +
			'&page=' + this.getPage() +
			( this.getProjectId() ? '&project_id=' + this.getProjectId() : '') +
			'&query=' + this.getQuery() +
			'&toolbox_action=remove_tag' +
			'&authenticity_token=' + this.getAuthenticityToken() +
			'&_=' + '';

		new Request({
			url: 'https://' + location.host + '/issues/remove_tag',
			'method': 'post'
		}).send(params);

	},

	getAuthenticityToken: function() {

		return encodeURIComponent(document.body.getElement('input[name=authenticity_token]').value);

	},

	getQuery: function() {

		var query = document.id('current_query');

		return query ? query.innerHTML : '';

	},

	getPage: function() {

		var page = document.id('total_pages_count');

		return page ? page.innerHTML : null;

	},

	getProjectId: function() {

		var select = document.id('new_task_dialog_project_selector'),
			project_id = null;

		if (select) {

			project_id = select[select.selectedIndex].value;

		}

		return project_id;

	}

});