const fs = require('fs');
const path = require('path');
const file = 'c:/Users/cho/Desktop/Temp/05 Code/260226_haema_arch/frontend/src/components/ui/CirculationLayoutPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace emerald, teal, cyan, violet, rose to orange/amber equivalents
content = content.replace(/emerald-/g, 'orange-');
content = content.replace(/teal-/g, 'orange-');
content = content.replace(/cyan-/g, 'amber-');
content = content.replace(/violet-/g, 'amber-');
content = content.replace(/rose-/g, 'orange-');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed CirculationLayoutPanel colors');
