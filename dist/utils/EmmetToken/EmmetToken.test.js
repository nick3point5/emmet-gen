import { expect } from 'vitest';
import { test, describe } from 'vitest';
import { EmmetToken } from './EmmetToken';
describe('EmmetToken class', () => {
    const tokens = {
        name: {
            string: 'hello',
            value: 'hello',
            type: 'name',
        },
        class: {
            string: '.',
            value: '',
            type: 'class',
        },
        id: {
            string: '#',
            value: '',
            type: 'id',
        },
        sibling: {
            string: '+',
            value: '',
            type: 'sibling',
        },
        child: {
            string: '>',
            value: '',
            type: 'child',
        },
        up: {
            string: '^',
            value: '',
            type: 'up',
        },
        empty1: {
            string: '/',
            value: '',
            type: 'empty',
        },
        empty2: {
            string: '\\',
            value: '',
            type: 'empty',
        },
        multiply: {
            string: '*123',
            value: '123',
            type: 'multiply',
        },
        multiplyStart: {
            string: '@123',
            value: '123',
            type: 'multiplyStart',
        },
        openGroup: {
            string: '(',
            value: '',
            type: 'openGroup',
        },
        closeGroup: {
            string: ')',
            value: '',
            type: 'closeGroup',
        },
        attribute: {
            string: '[hello="world"]',
            value: 'hello="world"',
            type: 'attr',
        },
    };
    for (const token in tokens) {
        test(`should get ${token} token`, () => {
            const { string, value, type } = tokens[token];
            const result = new EmmetToken(string);
            expect(result.value).toStrictEqual(value);
            expect(result.type).toStrictEqual(type);
        });
    }
});
//# sourceMappingURL=EmmetToken.test.js.map