import { describe, expect, test } from 'vitest'
import { undoTemplates } from './undoTemplates'

describe('undoTemplates', () => {
	test('initial test', () => {
		expect(undoTemplates()).toBe(undefined)
	})
})
