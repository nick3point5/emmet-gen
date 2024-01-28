import { expect } from 'vitest'
import { test, describe } from 'vitest'
import { parseTokens } from './parseTokens.js'
import { emmetLexer } from '../emmetLexer/emmetLexer.js'
import { parseEmmet } from '../parseEmmet/parseEmmet.js'
import { Settings } from '../Settings/Settings.js'
import { Template } from '../Template/Template.js'

Settings.init()

describe('should parse tokens', () => {
	test('name', () => {
		const string = 'hello'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		expect(root).toStrictEqual(hello)
	})
	test('siblings', () => {
		const string = 'hello+world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('child', () => {
		const string = 'hello>world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'default',
			className: 'default',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('up', () => {
		const string = 'hello>world^mister'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'default',
			className: 'default',
			previous: hello,
		})

		const mister = new Template({
			name: 'mister',
			location: `${Settings.baseUrl}`,
			type: 'default',
			className: 'default',
			previous: world,
		})

		hello.next = world
		world.next = mister

		expect(root).toStrictEqual(hello)
	})
	test('empty', () => {
		const string = '/hello'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'empty',
			className: 'default',
		})

		expect(root).toStrictEqual(hello)
	})
	test('empty chaining', () => {
		const string = '/hello/world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'empty',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'empty',
			className: 'default',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('multiply', () => {
		const string = 'hello$*10'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		let previous = undefined

		let hello

		const n = 10
		for (let i = 0; i < n; i++) {
			const helloCopy: Template = new Template({
				name: `hello${i + 1}`,
				location: Settings.baseUrl,
				type: 'default',
				className: 'default',
				previous,
			})

			if (i === 0) {
				hello = helloCopy
			} else if (previous) {
				previous.next = helloCopy
			}
			previous = helloCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('multiplyStart', () => {
		const string = 'hello$@5*10'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		let previous = undefined

		let hello

		const n = 10
		for (let i = 4; i < n; i++) {
			const helloCopy: Template = new Template({
				name: `hello${i + 1}`,
				location: Settings.baseUrl,
				type: 'default',
				className: 'default',
				previous,
			})

			if (i === 4) {
				hello = helloCopy
			} else if (previous) {
				previous.next = helloCopy
			}
			previous = helloCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('Group', () => {
		const string = '(hello$+world$)*5'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		let previous
		let hello

		const n = 5
		for (let i = 0; i < n; i++) {
			const helloCopy: Template = new Template({
				name: `hello${i + 1}`,
				location: Settings.baseUrl,
				type: 'default',
				className: 'default',
				previous: previous,
			})

			const worldCopy: Template = new Template({
				name: `world${i + 1}`,
				location: Settings.baseUrl,
				type: 'default',
				className: 'default',
				previous: helloCopy,
			})

			if (i === 0) {
				hello = helloCopy
			}
			if (previous) {
				previous.next = helloCopy
			}
			helloCopy.next = worldCopy
			previous = worldCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('attr', () => {
		const string = 'hello[world="yes"]'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		const worldMap = new Map()
		worldMap.set('world', 'yes')
		hello.replacements = worldMap

		expect(root).toStrictEqual(hello)
	})
	test('attr*5', () => {
		const string = 'hello$[world="yes"]*5'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		let hello
		let previous

		const worldMap = new Map()
		worldMap.set('world', 'yes')

		const n = 5
		for (let i = 0; i < n; i++) {
			const helloCopy: Template = new Template({
				name: `hello${i + 1}`,
				location: Settings.baseUrl,
				type: 'default',
				className: 'default',
				previous,
			})
			if (i === 0) {
				hello = helloCopy
			}
			if (previous) {
				previous.next = helloCopy
			}
			helloCopy.replacements = worldMap
			previous = helloCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('empty should not apply to children', () => {
		const string = '/hello>world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'empty',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'default',
			className: 'default',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('class should change type', () => {
		const string = 'hello.test'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'test',
			className: 'test',
		})

		expect(root).toStrictEqual(hello)
	})
	test('root class should apply to all', () => {
		const string = 'hello.test>world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'test',
			className: 'test',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'test',
			className: 'test',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('id should change type', () => {
		const string = 'test#test'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const test = new Template({
			name: 'test',
			location: Settings.baseUrl,
			type: 'test',
			className: 'default',
		})

		expect(root).toStrictEqual(test)
	})
	test('root class should apply to all', () => {
		const string = 'hello.test>world#default>thing'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)
		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'test',
			className: 'test',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'default',
			className: 'test',
			previous: hello,
		})

		const thing = new Template({
			name: 'thing',
			location: `${Settings.baseUrl}/hello/world`,
			type: 'test',
			className: 'test',
			previous: world,
		})

		hello.next = world
		world.next = thing

		expect(root).toStrictEqual(hello)
	})
	test('grouping children', () => {
		const string = 'hello>(to$+the$+world$)*3'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		let previous = hello

		for (let i = 0; i < 3; i++) {
			const toCopy = new Template({
				name: 'to'+(i+1),
				location: `${Settings.baseUrl}/hello`,
				type: 'default',
				className: 'default',
				previous: previous
			})
	
			const theCopy = new Template({
				name: 'the'+(i+1),
				location: `${Settings.baseUrl}/hello`,
				type: 'default',
				className: 'default',
				previous: toCopy
			})
	
			const worldCopy = new Template({
				name: 'world'+(i+1),
				location: `${Settings.baseUrl}/hello`,
				type: 'default',
				className: 'default',
				previous: theCopy
			})

			previous.next = toCopy
			toCopy.next = theCopy
			theCopy.next = worldCopy
			previous = worldCopy
		}

		expect(root).toStrictEqual(hello)
	})
})

describe('should parse examples', () => {
	test('Child: >', () => {
		const string = 'hello>world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'default',
			className: 'default',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('Sibling: +', () => {
		const string = 'hello+world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('Climb-up: ^', () => {
		const string = 'hello>to+the^world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		const to = new Template({
			name: 'to',
			location: `${Settings.baseUrl}/hello`,
			type: 'default',
			className: 'default',
			previous: hello
		})

		const the = new Template({
			name: 'the',
			location: `${Settings.baseUrl}/hello`,
			type: 'default',
			className: 'default',
			previous: to
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}`,
			type: 'default',
			className: 'default',
			previous: the,
		})

		hello.next = to
		to.next = the
		the.next = world

		expect(root).toStrictEqual(hello)
	})
	test('Multiplication: *', () => {
		const string = 'hello>world$*5'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		let previous = hello

		const n = 5
		for (let i = 0; i < n; i++) {
			const worldCopy: Template = new Template({
				name: `world${i + 1}`,
				location: `${Settings.baseUrl}/hello`,
				type: 'default',
				className: 'default',
				previous,
			})

			previous.next = worldCopy
			previous = worldCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('ID: #', () => {
		const string = 'hello>world#file'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'file',
			className: 'default',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('CLASS: .', () => {
		const string = 'hello.file'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'file',
			className: 'file',
		})

		expect(root).toStrictEqual(hello)
	})
	test('Replace Contents: ', () => {
		const string = 'hello[log="error"]'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const map = new Map()
		map.set('log', 'error')

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
			replacements: map,
		})

		expect(root).toStrictEqual(hello)
	})
	test('empty: /', () => {
		const string = '/hello/world'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'empty',
			className: 'default',
		})

		const world = new Template({
			name: 'world',
			location: `${Settings.baseUrl}/hello`,
			type: 'empty',
			className: 'default',
			previous: hello,
		})

		hello.next = world

		expect(root).toStrictEqual(hello)
	})
	test('Grouping: ()', () => {
		const string = 'hello>(to$+the$+world$)*5'
		const emmetString = emmetLexer(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken)

		const hello = new Template({
			name: 'hello',
			location: Settings.baseUrl,
			type: 'default',
			className: 'default',
		})

		let previous = hello

		for (let i = 0; i < 5; i++) {
			const toCopy = new Template({
				name: 'to'+(i+1),
				location: `${Settings.baseUrl}/hello`,
				type: 'default',
				className: 'default',
				previous: previous
			})
	
			const theCopy = new Template({
				name: 'the'+(i+1),
				location: `${Settings.baseUrl}/hello`,
				type: 'default',
				className: 'default',
				previous: toCopy
			})
	
			const worldCopy = new Template({
				name: 'world'+(i+1),
				location: `${Settings.baseUrl}/hello`,
				type: 'default',
				className: 'default',
				previous: theCopy
			})

			previous.next = toCopy
			toCopy.next = theCopy
			theCopy.next = worldCopy
			previous = worldCopy
		}

		expect(root).toStrictEqual(hello)
	})
})