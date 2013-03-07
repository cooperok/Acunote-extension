var OwnerField_Class = new Class({

	Extends: TaskField_class,

	name: 'owner',

	getCurrentTextValue: function() {

		return document.id('issue_owner_' + this.task.id).getElement('a').innerHTML;

	},

	getPosibleValues: function() {

		return document.id('owner_filter') || document.id('issue_dynamic_owner_editor');

	}

});