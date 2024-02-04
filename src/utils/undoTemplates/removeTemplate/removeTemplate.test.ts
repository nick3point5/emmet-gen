import { describe, expect, test } from 'vitest'
import { removeTemplate } from './removeTemplate'

describe('removeTemplate', () => {
	test('initial test', () => {
		expect(removeTemplate()).toBe(undefined)
	})
})
