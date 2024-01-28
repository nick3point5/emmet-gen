import { State, Template } from '../../parseTokens2'

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
