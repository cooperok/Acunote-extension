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