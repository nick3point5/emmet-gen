import { EmmetToken } from '../EmmetToken/EmmetToken.js'
import { Settings } from '../Settings/Settings.js'
import { Template } from '../Template/Template.js'
import { parseToken } from './parseToken/parseToken.js'

export type GroupState = {
	template: Template
	location: string
	multiplyStart: number
	tokenIndex: number
}

export type State = {
	template: Template
	location: string
	classStack: string[]
	multiplyStart: number
	tokenIndex: number
	tokens: EmmetToken[]
	groupCount: number
	group: GroupState[]
}

export function parseTokens(
	emmetTokens: EmmetToken[],
	groupCount = 0
) {
	const root = new Template({
		name: 'root',
		location: Settings.baseUrl,
		type: 'default',
		className: 'default',
	})

	let state: State = {
		template: root,
		location: Settings.baseUrl,
		classStack: ['default'],
		multiplyStart: 0,
		tokenIndex: 0,
		tokens: emmetTokens,
		groupCount: groupCount,
		group: []
	}

	while(state.tokenIndex < emmetTokens.length) {
		const instruction = parseToken(emmetTokens[state.tokenIndex])
		state = instruction(state)

		state.tokenIndex++
	}

	if(emmetTokens[0].type === 'openGroup' && root.next) {
		const openRoot = root.next
		openRoot.previous = undefined
		return openRoot
	}

	return root
}
