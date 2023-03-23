import { expect } from 'vitest'
import { test, describe } from 'vitest'
import { parseEmmet } from './parseEmmet.js'
import { EmmetToken } from '../EmmetToken/EmmetToken.js'
import { parseString } from '../parseString/parseString'

describe('should parse emmet', () => {
	test('default', () => {
		const string = 'hello.world>this+is>(an#example)*5'
		const emmetStrings = parseString(string)
		const result = parseEmmet(emmetStrings)

		const correct = [
			new EmmetToken('hello'),
			new EmmetToken('.'),
			new EmmetToken('world'),
			new EmmetToken('>'),
			new EmmetToken('this'),
			new EmmetToken('+'),
			new EmmetToken('is'),
			new EmmetToken('>'),
			new EmmetToken('('),
			new EmmetToken('an'),
			new EmmetToken('#'),
			new EmmetToken('example'),
			new EmmetToken(')'),
			new EmmetToken('*5'),
		]

		expect(result).toStrictEqual(correct)
	})
})
