var EstimateField_Class = new Class({

	Extends: TaskField_class,

	name: 'estimate',

	getValue: function() {

		this.value = $('issue_estimate_' + this.task.id).getElement('a').innerHTML;

	}

});