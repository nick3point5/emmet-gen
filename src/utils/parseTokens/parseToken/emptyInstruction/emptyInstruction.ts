import { Template } from '../../../Template/Template.js'
import { State } from '../../parseTokens.js'

export function emptyInstruction() {
	return (state: State) => {
		const { template, location } = state

		if (template.type === 'empty') {
			const newTemplate = new Template({
				name: '',
				location: location,
				type: 'empty',
				className: template.className,
				previous: template,
			})

			state.template = newTemplate
			template.next = newTemplate
			return state
		}

		template.type = 'empty' 
		return state
	}
}
