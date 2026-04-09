const fs = require('fs');
const path = require('path');
const uiDir = path.join(__dirname, 'frontend/src/components/ui');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // 1. Replace all rounded-xl with rounded-lg
            content = content.replace(/\brounded-xl\b/g, 'rounded-lg');

            // 2. Standardize buttons across panels
            // Common AI start button or sync button
            content = content.replace(/bg-blue-600/g, 'bg-orange-600');
            content = content.replace(/hover:bg-blue-700/g, 'hover:bg-orange-700');
            content = content.replace(/bg-indigo-600/g, 'bg-orange-600');
            content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-orange-700');
            content = content.replace(/from-blue-600 to-indigo-600/g, 'from-orange-500 to-orange-600');
            content = content.replace(/hover:from-blue-700 hover:to-indigo-700/g, 'hover:from-orange-600 hover:to-orange-700');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

walk(uiDir);
console.log('Done replacement.');
