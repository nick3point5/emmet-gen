import { EmmetToken } from '../../EmmetToken/EmmetToken.js'
import { State } from '../parseTokens.js'
import { nameInstruction } from './nameInstruction/nameInstruction.js'
import { siblingInstruction } from './siblingInstruction/siblingInstruction.js'
import { childInstruction } from './childInstruction/childInstruction.js'
import { upInstruction } from './upInstruction/upInstruction.js'
import { emptyInstruction } from './emptyInstruction/emptyInstruction.js'
import { multiplyInstruction } from './multiplyInstruction/multiplyInstruction.js'
import { multiplyStartInstruction } from './multiplyStartInstruction/multiplyStartInstruction.js'
import { openGroupInstruction } from './openGroupInstruction/openGroupInstruction.js'
import { attrInstruction } from './attrInstruction/attrInstruction.js'
import { classInstruction } from './classInstruction/classInstruction.js'
import { idInstruction } from './idInstruction/idInstruction.js'

export type Instruction = (
	state: State,
) => State
export function parseToken(token: EmmetToken): Instruction {
	switch (token.type) {
		case 'name':
			return nameInstruction(token)
		case 'sibling':
			return siblingInstruction()	
		case 'child':
			return childInstruction()	
		case 'up':
			return upInstruction()	
		case 'empty':
			return emptyInstruction()	
		case 'multiply':
			return multiplyInstruction(token)	
		case 'multiplyStart':
			return multiplyStartInstruction(token)	
		case 'openGroup':
			return openGroupInstruction()	
		case 'attr':
			return attrInstruction(token)	
		case 'class':
			return classInstruction()	
		case 'id':
			return idInstruction()	
		default:
			return nameInstruction(token)
	}

}