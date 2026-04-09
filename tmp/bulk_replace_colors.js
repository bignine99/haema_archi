const fs = require('fs');
const path = require('path');
const dir = path.resolve('c:/Users/cho/Desktop/Temp/05 Code/260226_haema_arch/frontend/src/components/ui');

// Target words to be replaced with Haema CI
const colorMap = {
    'emerald-': 'orange-',
    'teal-': 'orange-',
    'cyan-': 'amber-',
    'violet-': 'amber-',
    'fuchsia-': 'orange-',
    'rose-': 'orange-'
};

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    
    for (const [legacy, fresh] of Object.entries(colorMap)) {
        content = content.replace(new RegExp(legacy, 'g'), fresh);
    }
    
    // Also, we can ensure the word 'bg-indigo' and 'text-indigo' becomes slate or orange.
    content = content.replace(/indigo-/g, 'slate-');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed colors in ' + file);
    }
});
