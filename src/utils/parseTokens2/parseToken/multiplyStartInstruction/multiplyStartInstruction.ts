import { EmmetToken } from '../../../EmmetToken/EmmetToken'
import { State } from '../../parseTokens2'

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
