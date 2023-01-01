import Component from '@glimmer/component';
import { action } from '@ember/object';
//import { tracked } from '@glimmer/tracking';

export default class TypesListTableRowComponent extends Component {
	@action
	showOptions() {
		document.querySelector('#row-options-'+this.args.object.id).classList.remove('d-none');
	}

	@action
	hideOptions() {
		document.querySelector('#row-options-'+this.args.object.id).classList.add('d-none');
	}
}
