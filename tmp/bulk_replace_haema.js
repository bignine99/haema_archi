const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../frontend/src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/HAEMA/g, 'ARCHE');
    content = content.replace(/Haema/g, 'ARCHE');
    content = content.replace(/haema/g, 'arche');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            replaceInFile(fullPath);
        }
    }
}

processDirectory(targetDir);
console.log('Replacement complete.');
