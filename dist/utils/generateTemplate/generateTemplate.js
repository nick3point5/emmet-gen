import fs from 'fs';
import path from 'path';
import { Settings } from '../Settings/Settings.js';
export function generateTemplate(root) {
    let template = root;
    while (template) {
        const { location, type } = template;
        const source = findSource(type);
        createTemplate(source, location, template);
        template = template.next;
    }
}
function findSource(type) {
    const { templatesSource } = Settings;
    const source = path.resolve(`${templatesSource}/${type}`);
    if (!fs.existsSync(source)) {
        console.error(`no ${type} found at ${source}`);
        process.exit(1);
    }
    return source;
}
function createTemplate(source, destination, template) {
    var _a;
    const items = fs.readdirSync(source);
    const files = [];
    const directories = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemStat = fs.statSync(`${source}/${item}`);
        if (itemStat.isFile()) {
            files.push(item);
        }
        else if (itemStat.isDirectory()) {
            directories.push(item);
        }
    }
    for (let i = 0; i < directories.length; i++) {
        const srcDir = path.resolve(`${source}/${directories[i]}`);
        const destDir = path
            .resolve(`${destination}/${directories[i]}`)
            .replace(/__TemplateName__/g, template.name);
        fs.mkdirSync(destDir, { recursive: true });
        createTemplate(srcDir, destDir, template);
    }
    for (let i = 0; i < files.length; i++) {
        const srcFile = path.resolve(`${source}/${files[i]}`);
        const destFile = path
            .resolve(`${destination}/${files[i]}`)
            .replace(/__TemplateName__/g, template.name);
        let fileContent = fs.readFileSync(srcFile, 'utf8');
        (_a = template.replacements) === null || _a === void 0 ? void 0 : _a.forEach((value, key) => {
            fileContent = fileContent.replaceAll(key, value);
        });
        fileContent = fileContent.replace(/__TemplateName__/g, template.name);
        fs.writeFileSync(destFile, fileContent);
    }
}
//# sourceMappingURL=generateTemplate.js.map