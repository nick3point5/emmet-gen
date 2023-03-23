import { EmmetToken } from "../EmmetToken/EmmetToken"

export function parseEmmet(emmetStrings: string[]) {
	const emmetTokens = []

	for (let i = 0; i < emmetStrings.length; i++) {
		const tokenString = emmetStrings[i]

		emmetTokens.push(new EmmetToken(tokenString))
	}

	return emmetTokens
}
