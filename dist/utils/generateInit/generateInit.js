import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { InitTemplate } from '../InitTemplate/InitTemplate.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function generateInit(type) {
    let sourcePath;
    if (type === 'test') {
        sourcePath = path.resolve(`${__dirname}/../../data/initTest.json`);
    }
    else {
        sourcePath = path.resolve(`${__dirname}/../../data/init.json`);
    }
    const source = fs.readFileSync(sourcePath, 'utf8');
    const destPath = path.resolve(process.cwd());
    InitTemplate.createInit(destPath, source);
}
//# sourceMappingURL=generateInit.js.map