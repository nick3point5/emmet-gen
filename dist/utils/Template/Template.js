export class Template {
    constructor({ name, location, type = 'default', className = 'default', next, previous, replacements, }) {
        var _a, _b;
        this.name = name;
        this.location = location;
        this.type = type;
        this.className = className;
        (_a = this.next) !== null && _a !== void 0 ? _a : (this.next = next);
        (_b = this.previous) !== null && _b !== void 0 ? _b : (this.previous = previous);
        this.replacements = replacements || new Map();
    }
}
//# sourceMappingURL=Template.js.map