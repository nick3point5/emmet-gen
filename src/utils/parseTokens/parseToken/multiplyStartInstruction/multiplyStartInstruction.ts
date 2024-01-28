import { EmmetToken } from '../../../EmmetToken/EmmetToken.js'
import { State } from '../../parseTokens.js'

export function multiplyStartInstruction(token: EmmetToken) {
	return (state: State) => {
		const start = Number(token.value)
		if (start < 1 || isNaN(start)) {
			console.error('invalid multiplication number')
			process.exit(1)
		}
		state.multiplyStart = start - 1
		return state
	}
}
