import { test, describe, expect } from 'vitest'
import { emptyInstruction } from './emptyInstruction.js'

describe('emptyInstruction test', () => {
	test('should exist', () => {
		expect(emptyInstruction).toBeDefined()
	})
})
