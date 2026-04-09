const fs = require('fs');
const path = require('path');
const dir = path.resolve('c:/Users/cho/Desktop/Temp/05 Code/260226_haema_arch/frontend/src/components/ui');

function replaceColors(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Replace emerald and teal with orange
    content = content.replace(/emerald-/g, 'orange-');
    content = content.replace(/teal-/g, 'orange-');
    
    // Replace cyan with amber (as an accent color)
    content = content.replace(/cyan-/g, 'amber-');

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + path.basename(filePath));
    }
}

const filesToUpdate = [
    'SpecialDesignPanel.tsx', 
    'SpecialEngineeringPanel.tsx', 
    'StructuralEngineeringPanel.tsx',
    'SpecsAnalysisPanel.tsx' // Add this since it had some emerald/amber
];

filesToUpdate.forEach(file => {
    replaceColors(path.join(dir, file));
});
