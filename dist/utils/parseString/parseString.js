export function parseString(string) {
    const regexArray = [];
    const regexMatches = new Map([
        ['id', '\\#'],
        ['class', '\\.'],
        ['sibling', '\\+'],
        ['child', '\\>'],
        ['up', '\\^'],
        ['empty', '(\\\\|\\/)'],
        ['multiply', '\\*\\d+'],
        ['multiplyStart', '\\@\\d+'],
        ['openGroup', '\\('],
        ['closeGroup', '\\)'],
        ['attr', '\\[.*\\]'],
        ['name', '(\\w+|\\$+)+'],
    ]);
    regexMatches.forEach((value) => {
        regexArray.push(value);
    });
    const emmetRegex = new RegExp(`(${regexArray.join('|')})`, 'g');
    const emmetStrings = string.match(emmetRegex);
    return emmetStrings || [];
}
//# sourceMappingURL=parseString.js.map