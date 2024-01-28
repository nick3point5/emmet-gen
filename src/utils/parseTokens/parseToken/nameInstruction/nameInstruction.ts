import { EmmetToken } from '../../../EmmetToken/EmmetToken.js'
import { State } from '../../parseTokens.js'
import { replaceCountMarker } from '../../replaceCountMarker/replaceCountMarker.js'

export function nameInstruction(token: EmmetToken) {
	return (state: State) => {
		const { template, groupCount, tokens, tokenIndex } = state
		if (tokenIndex - 1 > 0 && tokens[tokenIndex - 1].type === 'class') {
			template.type = token.value
			template.className = token.value
			state.classStack[state.classStack.length - 1] = token.value
			return state
		}

		if (tokenIndex - 1 > 0 && tokens[tokenIndex - 1].type === 'id') {
			template.type = token.value
			return state
		}

		template.name = token.value

		if (template.type === 'empty') {
			state.location = state.location + '/' + token.value
		}

		if (groupCount > 0) {
			template.name = replaceCountMarker(token.value, groupCount)
		}

		return state
	}
}
