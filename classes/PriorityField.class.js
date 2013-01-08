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