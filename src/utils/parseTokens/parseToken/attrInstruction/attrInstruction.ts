import { EmmetToken } from '../../../EmmetToken/EmmetToken.js'
import { getReplacementMap } from '../../getReplacementMap/getReplacementMap.js'
import { State } from '../../parseTokens.js'

export function attrInstruction(token: EmmetToken) {
	return (state: State) => {
		const { template } = state
		template.replacements = getReplacementMap(token.value)
		return state
	}
}
