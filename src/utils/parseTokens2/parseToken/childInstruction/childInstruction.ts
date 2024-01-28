import { State, Template } from '../../parseTokens2'

export function childInstruction() {
	return (state: State) => {
		const { template, classStack } = state
		classStack.push(template.className)
		const location = template.location + '/' + template.name
		const newTemplate = new Template({
			name: '',
			location: location,
			type: classStack.at(-1)!,
			className: classStack.at(-1)!,
		})
		newTemplate.previous = template
		template.next = newTemplate

		state.template = newTemplate
		state.location = location
		return state
	}
}
