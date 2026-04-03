const fs = require('fs');
const path = require('path');
try {
    const storePath = path.join(__dirname, 'src', 'store', 'projectStore.ts');
    const typesPath = path.join(__dirname, 'src', 'store', 'types.ts');
    
    console.log("Reading storePath:", storePath);
    if (!fs.existsSync(storePath)) {
        console.log("File does not exist!");
        process.exit(1);
    }
    const content = fs.readFileSync(storePath, 'utf8');
    const lines = content.split('\n');
    console.log("Total lines:", lines.length);
    
    // Find the bounds exactly
    const typesStart = 11;
    const typesEnd = 466; // this is where } for ProjectState is. Let's make sure.
    
    if (lines[11].includes('─── 건축 용도 타입 ───')) {
        console.log("Found types start correctly.");
    }
    
    const typesContent = lines.slice(typesStart, typesEnd).join('\n');
    const imports = lines.slice(0, 11).join('\n'); 
    
    const newTypesFile = imports + "\n" + typesContent;
    fs.writeFileSync(typesPath, newTypesFile, 'utf8');
    console.log("Created types.ts");
    
    const newStoreContent = [
      ...lines.slice(0, 11),
      "import { ProjectState, DocumentInfo, BarrierFreeChecklist, FloorZoning, Room, BuildingUse, KakaoAddressResult, ParcelData, MOCK_PARCELS, TypologyType, MassingWing, MassingResult, SiteContext } from './types';",
      "import { ZONE_REGULATIONS } from '@/services/regulationEngine';",
      ...lines.slice(typesEnd)
    ].join('\n');
    
    fs.writeFileSync(storePath, newStoreContent, 'utf8');
    console.log("Updated projectStore.ts");
} catch(e) {
    console.error(e);
}
