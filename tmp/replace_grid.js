const fs = require('fs');

const spatialStrategyFile = 'c:/Users/cho/Desktop/Temp/05 Code/260226_haema_arch/frontend/src/components/ui/SpatialStrategyPanel.tsx';
let content = fs.readFileSync(spatialStrategyFile, 'utf8');

// Colors
content = content.replace(/emerald-/g, 'orange-');
content = content.replace(/teal-/g, 'orange-');
content = content.replace(/rose-/g, 'orange-');
content = content.replace(/cyan-/g, 'amber-');

// Grid layout 12 col
content = content.replace('<div className="flex flex-col lg:flex-row gap-6">', '<div className="grid grid-cols-1 md:grid-cols-12 gap-6">');
content = content.replace('className="flex-[3] flex flex-col min-w-0"', 'className="md:col-span-12 lg:col-span-8 flex flex-col min-w-0"');
content = content.replace('className="flex-[2] flex flex-col min-w-0"', 'className="md:col-span-12 lg:col-span-4 flex flex-col min-w-0"');

fs.writeFileSync(spatialStrategyFile, content, 'utf8');
console.log('Fixed SpatialStrategyPanel');

const bubbleDiagramFile = 'c:/Users/cho/Desktop/Temp/05 Code/260226_haema_arch/frontend/src/components/ui/BubbleDiagramPanel.tsx';
let bubbleContent = fs.readFileSync(bubbleDiagramFile, 'utf8');
bubbleContent = bubbleContent.replace('<div className="flex flex-col lg:flex-row h-full gap-5">', '<div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">');
bubbleContent = bubbleContent.replace('className="w-full lg:w-3/4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative"', 'className="md:col-span-12 lg:col-span-9 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative"');
bubbleContent = bubbleContent.replace('className="w-full lg:w-1/4 flex flex-col gap-5 overflow-y-auto custom-scrollbar"', 'className="md:col-span-12 lg:col-span-3 flex flex-col gap-5 overflow-y-auto custom-scrollbar"');
fs.writeFileSync(bubbleDiagramFile, bubbleContent, 'utf8');
console.log('Fixed BubbleDiagramPanel');
