import { Template } from '../../../Template/Template'
import { State } from '../../parseTokens'

export function upInstruction() {
	return (state: State) => {
		const { template, location, classStack } = state
		const className = classStack.pop()
		if(className === undefined) {
			console.error('cannot go up further')
			process.exit(1)
		}

		const newLocation = location.split('/').slice(0, -1).join('/')
		const newTemplate = new Template({
			name: '',
			location: newLocation,
			type: 'default',
			className: className,
		})
		newTemplate.previous = template
		template.next = newTemplate

		state.template = newTemplate
		state.location = newLocation
		return state
	}
}
