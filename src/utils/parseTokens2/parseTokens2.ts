import { EmmetToken } from '../EmmetToken/EmmetToken'
import { Settings } from '../Settings/Settings'
import { parseToken } from './parseToken/parseToken'

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

export function parseTokens2(
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

type TemplateProps = {
	name: string
	location: string
	type: string
	className: string
	next?: Template
	previous?: Template
	replacements?: Map<string, string>
}

export class Template {
	name: string
	location: string
	type: string
	next?: Template
	previous?: Template
	replacements: Map<string, string>
	className: string
	constructor({
		name,
		location,
		type = 'default',
		className = 'default',
		next,
		previous,
		replacements,
	}: TemplateProps) {
		this.name = name
		this.location = location
		this.type = type
		this.className = className
		this.next ??= next
		this.previous ??= previous
		this.replacements = replacements || new Map<string, string>()
	}
}