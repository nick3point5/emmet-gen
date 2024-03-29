import { State } from '../../parseTokens.js'

export function openGroupInstruction() {
	return (state: State) => {
		state.group.push({
			template: state.template,
			location: state.location,
			multiplyStart: 0,
			tokenIndex: state.tokenIndex + 1,
		})

		state.tokenIndex = findClosingGroup(state)
		return state
	}
}

function findClosingGroup(state: State) {
	const { template, tokenIndex, tokens } = state
	let openCount = 1
	let index = tokenIndex

	if (template.name === '' && template.previous) {
		const parentTemplate = template.previous
		state.template = parentTemplate
	}

	while (index < tokens.length) {
		if (tokens[index].type === 'openGroup') {
			openCount++
		} else if (tokens[index].type === 'closeGroup') {
			openCount--
			if (openCount > 0) break
		}
		index++
	}

	return index
}
