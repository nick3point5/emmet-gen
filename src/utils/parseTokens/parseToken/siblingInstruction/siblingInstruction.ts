import { Template } from '../../../Template/Template.js'
import { State } from '../../parseTokens.js'

export function siblingInstruction() {
	return (state: State) => {
		const { template, location, classStack } = state
		const newTemplate = new Template({
			name: '',
			location: location,
			type: 'default',
			className: classStack.at(-1)!,
		})
		newTemplate.previous = template
		template.next = newTemplate

		state.template = newTemplate
		return state
	}
}
