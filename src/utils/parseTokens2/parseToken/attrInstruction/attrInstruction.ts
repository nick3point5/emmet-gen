import { EmmetToken } from '../../../EmmetToken/EmmetToken'
import { getReplacementMap } from '../../../getReplacementMap/getReplacementMap'
import { State } from '../../parseTokens2'

export function attrInstruction(token: EmmetToken) {
	return (state: State) => {
		const { template } = state
		template.replacements = getReplacementMap(token.value)
		return state
	}
}
