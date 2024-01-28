export function replaceCountMarker(name: string, count: number) {
	const match = name.match(/\$+/g)
	if (!match) {
		console.error('root template must have "$" in name')
		process.exit(1)
	}
	const padLength = match[0].length

	const countName = String(count).padStart(padLength, '0')
	return name.replace(/\$+/g, countName)
}

