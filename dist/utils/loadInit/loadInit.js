var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { InitTemplate } from '../InitTemplate/InitTemplate.js';
import path from 'path';
import fs from 'fs';
export function loadInit(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let template;
            if (!name) {
                const saveLocation = path.resolve(process.cwd(), 'emmet-save.json');
                template = fs.readFileSync(saveLocation, 'utf8');
            }
            else {
                const result = yield fetch(`https://nick3point5-emmet-gen-api.deno.dev/${name}`);
                const json = yield result.json();
                template = json.data;
            }
            if (typeof template !== 'string') {
                throw new Error('template is not a string');
            }
            InitTemplate.createInit(process.cwd(), template);
        }
        catch (error) {
            console.log('something went wrong');
        }
        // InitTemplate.createInit(process.cwd(), template)
    });
}
//# sourceMappingURL=loadInit.js.map