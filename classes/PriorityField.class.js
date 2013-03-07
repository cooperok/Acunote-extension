var PriorityField_Class = new Class({

	Extends: TaskField_class,

	name: 'priority',

	getCurrentTextValue: function() {

		return document.id('issue_priority_' + this.task.id).getElement('a').innerHTML;

	},

	getPosibleValues: function() {

		return document.id('task_dynamic_priority_editor') || document.id('issue_dynamic_priority_editor');

	}

});