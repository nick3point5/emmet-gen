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
export function loadInit(name) {
    return __awaiter(this, void 0, void 0, function* () {
        // const saveLocation = path.resolve(savePath)
        // const template = fs.readFileSync(saveLocation, 'utf8')
        try {
            console.clear();
            console.log('loading...');
            const result = yield fetch(`https://nick3point5-emmet-gen-api.deno.dev/${name}`);
            const json = yield result.json();
            const template = json.data;
            InitTemplate.createInit(process.cwd(), template);
            console.clear();
            console.log('loaded!');
        }
        catch (error) {
            console.log('something went wrong');
        }
        // InitTemplate.createInit(process.cwd(), template)
    });
}
//# sourceMappingURL=loadInit.js.map