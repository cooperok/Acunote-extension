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