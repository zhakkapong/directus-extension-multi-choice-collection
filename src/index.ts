import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'multi-choice-collection',
	name: 'Multi choice (collection) ',
	description: 'Multiple choice from a collection',
	icon: 'check_box',
	group: 'selection',
	types: ['json'],
	component: InterfaceComponent,
	options: () => {
		return [
			{
				field: 'source',
				name: '$t:source',
				type: 'string',
				meta: {
					width: 'full',
					interface: 'system-collection',
					options: {
						placeholder: '$t:enter_a_placeholder',
					},
				},
			},
		];
	},
});
