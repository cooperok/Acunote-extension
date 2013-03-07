var StatusField_class = new Class({

	Extends: TaskField_class,

	name: 'status',

	getCurrentTextValue: function() {

		return document.id('issue_status_' + this.task.id).getElement('a').innerHTML;

	},

	getPosibleValues: function() {

		return document.id('task_dynamic_status_editor') || document.id('issue_current_status');

	}

});