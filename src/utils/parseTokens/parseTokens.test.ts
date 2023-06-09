import path from 'path'
import { expect } from 'vitest'
import { test, describe } from 'vitest'
import { parseTokens } from './parseTokens.js'
import { parseString } from '../parseString/parseString.js'
import { parseEmmet } from '../parseEmmet/parseEmmet.js'
import { getConfig } from '../getConfig.js'
import { Template } from '../Template/Template.js'

const { settings } = getConfig()

describe('should parse tokens', () => {
	test('siblings', () => {
		const string = 'hello+world'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const world = new Template({
			name: 'world',
			location: settings.baseUrl,
			type: 'default',
			settings,
		})

		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'default',
			nextSibling: world,
			settings,
		})

		expect(root).toStrictEqual(hello)
	})
	test('child', () => {
		const string = 'hello>world'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const world = new Template({
			name: 'world',
			location: `${settings.baseUrl}/hello`,
			type: 'default',
			settings,
		})

		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'default',
			child: world,
			settings,
		})
		expect(root).toStrictEqual(hello)
	})
	test('up', () => {
		const string = 'hello>world^mister'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const world = new Template({
			name: 'world',
			location: `${settings.baseUrl}/hello`,
			type: 'default',
			settings,
		})

		const mister = new Template({
			name: 'mister',
			location: `${settings.baseUrl}`,
			type: 'default',
			settings,
		})

		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'default',
			child: world,
			nextSibling: mister,
			settings,
		})

		expect(root).toStrictEqual(hello)
	})
	test('empty', () => {
		const string = '/hello'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'empty',
			settings,
		})

		expect(root).toStrictEqual(hello)
	})
	test('multiply', () => {
		const string = 'hello$*10'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		let previous = null

		let hello

		const n = 10
		for (let i = 0; i < n; i++) {
			const helloCopy: Template = new Template({
				name: `hello${i + 1}`,
				location: settings.baseUrl,
				type: 'default',
				previous,
				settings,
			})

			if (i === 0) {
				hello = helloCopy
			} else if (previous) {
				previous.nextSibling = helloCopy
			}
			previous = helloCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('multiplyStart', () => {
		const string = 'hello$@5*10'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		let previous = null

		let hello

		const n = 10
		for (let i = 4; i < n; i++) {
			const helloCopy: Template = new Template({
				name: `hello${i + 1}`,
				location: settings.baseUrl,
				type: 'default',
				previous,
				settings,
			})

			if (i === 4) {
				hello = helloCopy
			} else if (previous) {
				previous.nextSibling = helloCopy
			}
			previous = helloCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('Group', () => {
		const string = '(hello$+world$)*5'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		let previous = null

		let hello

		const n = 5
		for (let i = 0; i < n; i++) {
			const worldCopy = new Template({
				name: `world${i + 1}`,
				location: settings.baseUrl,
				type: 'default',
				settings,
			})

			const helloCopy = new Template({
				name: `hello${i + 1}`,
				location: settings.baseUrl,
				type: 'default',
				nextSibling: worldCopy,
				settings,
			})

			if (i === 0) {
				hello = helloCopy
			} else if (previous) {
				previous.nextSibling = helloCopy
			}
			previous = worldCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('attr', () => {
		const string = 'hello[world="yes"]'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'default',
			settings,
		})

		const worldMap = new Map()
		worldMap.set('world', 'yes')
		hello.replacements = worldMap

		expect(root).toStrictEqual(hello)
	})
	test('attr*5', () => {
		const string = 'hello$[world="yes"]*5'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		let hello
		let previous

		const worldMap = new Map()
		worldMap.set('world', 'yes')

		const n = 5
		for (let i = 0; i < n; i++) {
			const helloCopy: Template = new Template({
				name: `hello${i + 1}`,
				location: settings.baseUrl,
				type: 'default',
				previous,
				settings,
			})
			if (i === 0) {
				hello = helloCopy
			} else if (previous) {
				previous.nextSibling = helloCopy
			}
			helloCopy.replacements = worldMap
			previous = helloCopy
		}

		expect(root).toStrictEqual(hello)
	})
	test('empty should not apply to children', () => {
		const string = '/hello>world'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const world = new Template({
			name: 'world',
			location: `${settings.baseUrl}/hello`,
			type: 'default',
			settings,
		})

		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'empty',
			child: world,
			settings,
		})

		expect(root).toStrictEqual(hello)
	})
	test('root class should apply to all', () => {
		const string = '.test>hello'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'test',
			settings,
		})

		expect(root).toStrictEqual(hello)
	})
	test('class should overwrite empty parent', () => {
		const string = '/hello/world/thing.test'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const thing = new Template({
			name: 'thing',
			location: `${settings.baseUrl}/hello/world`,
			type: 'test',
			settings,
		})

		const world = new Template({
			name: 'world',
			location: `${settings.baseUrl}/hello`,
			type: 'empty',
			child: thing,
			settings,
		})
		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'empty',
			child: world,
			settings,
		})

		hello.templateSrc = path.resolve(settings.templatesSource, './empty')
		world.templateSrc = path.resolve(settings.templatesSource, './empty')
		thing.templateSrc = path.resolve(settings.templatesSource, './test')

		expect(root).toStrictEqual(hello)
	})
	test('root class should apply to all', () => {
		const string = '.test>/hello/world>thing'
		const emmetString = parseString(string)
		const emmetToken = parseEmmet(emmetString)
		const root = parseTokens(emmetToken, settings)

		const thing = new Template({
			name: 'thing',
			location: `${settings.baseUrl}/hello/world`,
			type: 'test',
			settings,
		})

		const world = new Template({
			name: 'world',
			location: `${settings.baseUrl}/hello`,
			type: 'empty',
			child: thing,
			settings,
		})
		const hello = new Template({
			name: 'hello',
			location: settings.baseUrl,
			type: 'empty',
			child: world,
			settings,
		})

		hello.templateSrc = path.resolve(settings.templatesSource, './empty')
		world.templateSrc = path.resolve(settings.templatesSource, './empty')
		thing.templateSrc = path.resolve(settings.templatesSource, './test')

		expect(root).toStrictEqual(hello)
	})
})
