import { test, describe, expect } from 'vitest'
import { Settings } from './Settings'
import path from 'path'


describe('Settings test', () => {
	test('should exist', () => {
		expect(Settings).toBeDefined()
	})
	test('should read json', () => {
		Settings.configLocation = path.resolve(process.cwd(), './emmet-gen-templates.json')
		Settings.reset()

		expect(Settings.auto_imports).toBe(false)
		expect(Settings.relative).toBe(true)
		expect(Settings.templatesSource).toBe(path.resolve(process.cwd(), './emmet-gen-templates'))
		expect(Settings.baseUrl).toBe(path.resolve(process.cwd(), './'))
	})
})
