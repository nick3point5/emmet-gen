import { EmmetToken } from '../../../EmmetToken/EmmetToken.js'
import { Template } from '../../../Template/Template.js'
import { State, parseTokens } from '../../parseTokens.js'
import { replaceCountMarker } from '../../replaceCountMarker/replaceCountMarker.js'

export function multiplyInstruction( token: EmmetToken ) {
	const n = Number(token.value)
	if (n < 1 || isNaN(n)) {
		console.error('invalid multiplication number')
		process.exit(1)
	}
	return (state: State) => {
		if(state.group.length > 0 && state.tokens[state.tokenIndex-1].type === 'closeGroup') {
			return multiplyGroup(state, n)
		}
		return multiply(state, n)
	}
}

function multiply(state: State, n: number) {
	const { multiplyStart } = state
	let { template } = state

	const genericName = template.name

	for (let i = multiplyStart; i < n; i++) {
		const name = replaceCountMarker(genericName, i + 1)

		template.name = name

		const newTemplate = new Template({
			name: '',
			location: template.location,
			type: template.type,
			className: template.className,
			previous: template,
			replacements: template.replacements,
		})

		

		template.next = newTemplate
		template = newTemplate
	}

	if (!template.previous) {
		console.error('invalid multiplication number')
		process.exit(1)
	}
	template = template.previous
	template.next = undefined

	state.template = template
	state.multiplyStart = 0
	return state
}
function multiplyGroup(state: State, n: number) {
	const groupState = state.group.pop()
	if(!groupState) {
		console.error('unmatched group')
		process.exit(1)
	}
	const groupTokens = state.tokens.slice(groupState.tokenIndex, state.tokenIndex-1)

	let { template } = state
	
	for(let i = 0; i < n; i++) {
		const groupRoot = parseTokens(groupTokens, i+1)
		groupRoot.previous = template
		template.next = groupRoot
		template = getLastTemplate(groupRoot)
	}

	state.template = template
	state.multiplyStart = 0
	return state
}

function getLastTemplate(template: Template) {
	while (template.next) {
		template = template.next
	}
	return template
}