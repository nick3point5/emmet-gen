import { test, describe, expect } from 'vitest'
import { getReplacementMap } from './getReplacementMap.js'

describe('getReplacementMap test', () => {
	test('should exist', () => {
		expect(getReplacementMap).toBeDefined()
	})
	test('should parse value', () => {
		const tokenValue = '[Hello="world"]'
		const map = new Map([['Hello', 'world']])

		expect(getReplacementMap(tokenValue)).toStrictEqual(map)
	})
	test('should parse value with space', () => {
		const tokenValue = '[title="Hello world"]'
		const map = new Map([['title', 'Hello world']])

		expect(getReplacementMap(tokenValue)).toStrictEqual(map)
	})
	test('should parse value with single quotes', () => {
		const tokenValue = "[title='Hello world']"
		const map = new Map([['title', 'Hello world']])

		expect(getReplacementMap(tokenValue)).toStrictEqual(map)
	})
	test('should parse value multiple attributes', () => {
		const tokenValue = '[a=\'value1\' b="value2"]'
		const map = new Map([
			['a', 'value1'],
			['b', 'value2'],
		])

		expect(getReplacementMap(tokenValue)).toStrictEqual(map)
	})
})
