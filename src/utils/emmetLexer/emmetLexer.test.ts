import { expect } from 'vitest'
import { test, describe } from 'vitest'
import { emmetLexer } from './emmetLexer.js'

describe('parseString', () => {
	test('should get name', () => {
		const string = 'hello'
		const result = emmetLexer(string)
		const correct = ['hello']
		expect(result).toStrictEqual(correct)
	})
	test('should get class', () => {
		const string = 'hello.class'
		const result = emmetLexer(string)
		const correct = ['hello', '.', 'class']
		expect(result).toStrictEqual(correct)
	})
	test('should get id', () => {
		const string = 'hello#id'
		const result = emmetLexer(string)
		const correct = ['hello', '#', 'id']
		expect(result).toStrictEqual(correct)
	})
	test('should get sibling', () => {
		const string = 'hello+sibling'
		const result = emmetLexer(string)
		const correct = ['hello', '+', 'sibling']
		expect(result).toStrictEqual(correct)
	})
	test('should get child', () => {
		const string = 'hello>child'
		const result = emmetLexer(string)
		const correct = ['hello', '>', 'child']
		expect(result).toStrictEqual(correct)
	})
	test('should get up', () => {
		const string = 'hello^up'
		const result = emmetLexer(string)
		const correct = ['hello', '^', 'up']
		expect(result).toStrictEqual(correct)
	})
	test('should get empty /', () => {
		const string = '/empty'
		const result = emmetLexer(string)
		const correct = ['/', 'empty']
		expect(result).toStrictEqual(correct)
	})
	test('should get empty \\', () => {
		const string = '\\empty'
		const result = emmetLexer(string)
		const correct = ['\\', 'empty']
		expect(result).toStrictEqual(correct)
	})
	test('should get multiply', () => {
		const string = 'hello*5'
		const result = emmetLexer(string)
		const correct = ['hello', '*5']
		expect(result).toStrictEqual(correct)
	})
	test('should get multiplyStart', () => {
		const string = 'hello@3*5'
		const result = emmetLexer(string)
		const correct = ['hello', '@3', '*5']
		expect(result).toStrictEqual(correct)
	})
	test('should get Group', () => {
		const string = 'hello>(world)'
		const result = emmetLexer(string)
		const correct = ['hello', '>', '(', 'world', ')']
		expect(result).toStrictEqual(correct)
	})
	test('should get attribute', () => {
		const string = 'hello[place="world"]'
		const result = emmetLexer(string)
		const correct = ['hello', '[place="world"]']
		expect(result).toStrictEqual(correct)
	})
})
